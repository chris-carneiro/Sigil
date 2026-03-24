package dev.silentcraft.sigil.domain.service;

import java.nio.file.Path;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import dev.silentcraft.sigil.domain.cache.DocumentCache;
import dev.silentcraft.sigil.domain.entity.Document;
import dev.silentcraft.sigil.domain.error.BlobStorageException;
import dev.silentcraft.sigil.domain.error.DocumentAccessRevokedException;
import dev.silentcraft.sigil.domain.error.DocumentNotFoundException;
import dev.silentcraft.sigil.domain.repository.BlobStorage;
import dev.silentcraft.sigil.domain.repository.DocumentRepository;
import dev.silentcraft.sigil.domain.valueobject.DocumentCacheEntry;
import dev.silentcraft.sigil.domain.valueobject.DocumentIdentity;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.ResolvedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

@Service
public class DocumentService {

    private final Path locationPath;
    private final Duration documentValidityDays;

    private final DocumentRepository documentRepository;
    private final BlobStorage blobStorage;
    private final DocumentCache documentCache;

    public DocumentService(DocumentRepository documentRepository,
                           @Value("${sigil.document.location.path}") String locationPath,
                           @Value("${sigil.defaults.document.validity-days}") Long documentValidityDays,
                           BlobStorage blobStorage,
                           DocumentCache documentCache) {
        this.locationPath = Path.of(locationPath).normalize().toAbsolutePath();
        this.documentRepository = documentRepository;
        this.documentValidityDays = Duration.of(documentValidityDays, ChronoUnit.DAYS);
        this.blobStorage = blobStorage;
        this.documentCache = documentCache;
    }

    @Transactional
    public DocumentIdentity store(EncryptedDocument encryptedDocument) {
        UUID fileId = UUID.randomUUID();
        Document document = documentRepository.save(toEntity(encryptedDocument, fileId));

        blobStorage.store(locationPath, fileId.toString(), encryptedDocument.encryptedFile());

        DocumentCacheEntry cacheEntry = new DocumentCacheEntry(document.blobPath(), document.iv(), document.isRevoked());
        documentCache.put(fileId.toString(), cacheEntry, Duration.between(Instant.now(), document.expiresAt()));
        return new DocumentIdentity(fileId);
    }

    public StoredDocument find(UUID identity) {
        try {
            Optional<ResolvedDocument> resolvedDocument = resolveDocumentCacheEntry(identity)
                    .or(() -> resolveDocument(identity));

            if (resolvedDocument.isPresent()) {
                var document = resolvedDocument.get();
                if (document.revoked()) {
                    throw new DocumentAccessRevokedException();
                }
                byte[] blob = blobStorage.read(document.fileLocation());
                return new StoredDocument(blob, document.iv());
            }
            throw new DocumentNotFoundException();
        } catch (
                BlobStorageException e) {
            throw new DocumentNotFoundException();
        }
    }

    private Optional<ResolvedDocument> resolveDocument(UUID identity) {
        return documentRepository.findById(identity).map(
                doc -> {
                    return new ResolvedDocument(Path.of(doc.blobPath()), doc.iv(), doc.isRevoked());
                }
        );
    }

    private Optional<ResolvedDocument> resolveDocumentCacheEntry(UUID key) {
        return documentCache.get(key.toString()).map(
                doc -> {

                    return new ResolvedDocument(Path.of(doc.fileLocation()), doc.iv(), doc.isRevoked());
                }
        );
    }


    private Document toEntity(EncryptedDocument properties, UUID fileId) {
        String blobPath = "%s/%s".formatted(locationPath, fileId);
        return new Document(fileId,
                blobPath,
                properties.fileIv(),
                Instant.now().plus(documentValidityDays)
        );
    }

    public void revoke(UUID documentId) {
        documentRepository.findById(documentId)
                .ifPresent(document -> {
                    documentRepository.save(document.markRevoked());
                    // silently ignoring non existing document - avoid enumeration attack
                });

        documentCache.evict(documentId.toString());
    }
}
