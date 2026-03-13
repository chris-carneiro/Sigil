package dev.silentcraft.sigil.domain.service;

import java.nio.file.Path;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import dev.silentcraft.sigil.domain.entity.Document;
import dev.silentcraft.sigil.domain.repository.DocumentRepository;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

@Service
public class DocumentService {

    private final Path locationPath;

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository,
                           @Value("${sigil.document.location.path}") String locationPath) {
        this.locationPath = Path.of(locationPath);
        this.documentRepository = documentRepository;
    }

    public StoredDocument store(EncryptedDocument encryptedDocument) {
        Document document = documentRepository.save(toEntity(encryptedDocument));
        return new StoredDocument(document.identity());
    }


    private Document toEntity(EncryptedDocument properties) {
        UUID documentId = UUID.randomUUID();
        String blobPath = "%s/%s".formatted(locationPath.normalize().toAbsolutePath(), documentId);
        return new Document(documentId,
                properties.fileName(),
                blobPath,
                properties.fileSize(),
                properties.fileIv()
        );
    }

    public Optional<StoredDocument> find(UUID identity) {
        return documentRepository.findById(identity)
                .map(document -> new StoredDocument(document.identity()));
    }
}
