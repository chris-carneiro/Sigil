package dev.silentcraft.sigil.domain.service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import dev.silentcraft.sigil.domain.entity.Document;
import dev.silentcraft.sigil.domain.error.DocumentAccessRevokedException;
import dev.silentcraft.sigil.domain.error.DocumentNotFoundException;
import dev.silentcraft.sigil.domain.repository.DocumentRepository;
import dev.silentcraft.sigil.domain.valueobject.DocumentIdentity;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

@Service
public class DocumentService {

    public static final Instant NOT_REVOKED = null;
    private final Path locationPath;

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository,
                           @Value("${sigil.document.location.path}") String locationPath) {
        this.locationPath = Path.of(locationPath);
        this.documentRepository = documentRepository;
    }

    public DocumentIdentity store(EncryptedDocument encryptedDocument) {
        Document document = documentRepository.save(toEntity(encryptedDocument));

        return new DocumentIdentity(document.identity());
    }

    public StoredDocument find(UUID identity) {
        return documentRepository.findById(identity)
                .map(document -> {
                    if (document.isRevoked()) {
                        throw new DocumentAccessRevokedException();
                    }
                            return new StoredDocument(document.blobPath().getBytes(StandardCharsets.UTF_8),
                                    document.iv(),
                                    document.fileName(),
                                    null);
                        }
                )
                .orElseThrow(DocumentNotFoundException::new);
    }

    private Document toEntity(EncryptedDocument properties) {
        UUID documentId = UUID.randomUUID();
        String blobPath = "%s/%s".formatted(locationPath.normalize().toAbsolutePath(), documentId);
        return new Document(documentId,
                properties.fileName(),
                blobPath,
                properties.fileSize(),
                properties.fileIv(),
                NOT_REVOKED
        );
    }
}
