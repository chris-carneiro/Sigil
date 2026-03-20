package dev.silentcraft.sigil.domain.service;

import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.silentcraft.sigil.domain.entity.Document;
import dev.silentcraft.sigil.domain.error.DocumentAccessRevokedException;
import dev.silentcraft.sigil.domain.error.DocumentNotFoundException;
import dev.silentcraft.sigil.domain.repository.BlobStorage;
import dev.silentcraft.sigil.domain.repository.DocumentRepository;
import dev.silentcraft.sigil.domain.valueobject.DocumentIdentity;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

@Service
public class DocumentService {

    private final Path locationPath;

    private final DocumentRepository documentRepository;
    private final BlobStorage blobStorage;

    public DocumentService(DocumentRepository documentRepository,
                           @Value("${sigil.document.location.path}") String locationPath, BlobStorage blobStorage) {
        this.locationPath = Path.of(locationPath).normalize().toAbsolutePath();
        this.documentRepository = documentRepository;
        this.blobStorage = blobStorage;
    }

    @Transactional
    public DocumentIdentity store(EncryptedDocument encryptedDocument) {
        UUID fileId = UUID.randomUUID();
        documentRepository.save(toEntity(encryptedDocument, fileId));

        blobStorage.store(locationPath, fileId.toString(), encryptedDocument.encryptedFile());
        return new DocumentIdentity(fileId);
    }

    public StoredDocument find(UUID identity) {
        return documentRepository.findById(identity)
                .map(document -> {
                            if (document.isRevoked()) {
                                throw new DocumentAccessRevokedException();
                            }
                            Path documentPath = Path.of(document.blobPath());
                            return new StoredDocument(blobStorage.read(documentPath),
                                    document.iv()
                            );
                        }
                )
                .orElseThrow(DocumentNotFoundException::new);
    }

    private Document toEntity(EncryptedDocument properties, UUID fileId) {
        String blobPath = "%s/%s".formatted(locationPath, fileId);
        return new Document(fileId,
                blobPath,
                properties.fileIv()
        );
    }
}
