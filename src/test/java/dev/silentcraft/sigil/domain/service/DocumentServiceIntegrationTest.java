package dev.silentcraft.sigil.domain.service;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import org.assertj.core.api.Assertions;
import org.assertj.core.data.TemporalUnitWithinOffset;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import dev.silentcraft.sigil.domain.cache.DocumentCache;
import dev.silentcraft.sigil.domain.entity.Document;
import dev.silentcraft.sigil.domain.error.DocumentAccessRevokedException;
import dev.silentcraft.sigil.domain.error.DocumentNotFoundException;
import dev.silentcraft.sigil.domain.repository.BlobStorage;
import dev.silentcraft.sigil.domain.repository.DocumentRepository;
import dev.silentcraft.sigil.domain.valueobject.DocumentCacheEntry;
import dev.silentcraft.sigil.domain.valueobject.DocumentIdentity;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;


@SpringBootTest
@Testcontainers
@Tag("IntegrationTests")
@Transactional
class DocumentServiceIntegrationTest {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentCache documentCache;

    @Autowired
    private BlobStorage blobStorage;

    @TempDir
    private static Path tempDir;

    private static final Long TEST_VALIDITY_DAYS = 6L;

    @Container
    private static final GenericContainer<?> redis = new GenericContainer<>("redis:8.6-alpine")
            .withExposedPorts(6379);


    @Container
    private static final PostgreSQLContainer<?> postgresDB = new PostgreSQLContainer<>("postgres:15.17")
            .withDatabaseName("test-sigil-db")
            .withUsername("test-user")
            .withPassword("test-user");


    @DynamicPropertySource
    static void setApplicationProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgresDB::getJdbcUrl);
        registry.add("spring.datasource.username", postgresDB::getUsername);
        registry.add("spring.datasource.password", postgresDB::getPassword);
        registry.add("sigil.document.location.path", () -> tempDir.toString());
        registry.add("sigil.defaults.document.validity-days", () -> TEST_VALIDITY_DAYS);
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }

    @Test
    void store_returnsStoredDocument_whenSuccessful() {
        // GIVEN
        EncryptedDocument properties = new EncryptedDocument("test".getBytes(StandardCharsets.UTF_8), "iv".getBytes(StandardCharsets.UTF_8));

        // WHEN
        DocumentIdentity result = documentService.store(properties);

        // THEN
        Assertions.assertThat(result).isNotNull();
    }

    @Test
    void find_returnsStoredDocument_whenDocumentExists() {
        // GIVEN
        EncryptedDocument encryptedDocument = new EncryptedDocument("test".getBytes(StandardCharsets.UTF_8), "iv".getBytes(StandardCharsets.UTF_8));
        DocumentIdentity document = documentService.store(encryptedDocument);

        // WHEN
        StoredDocument result = documentService.find(document.id());

        // THEN
        Assertions.assertThat(result)
                .extracting(StoredDocument::encryptedBlob)
                .isEqualTo("test".getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void find_throwsDocumentAccessRevokedException_whenDocumentIsRevoked() {
        // GIVEN
        final UUID revokedDocumentId = UUID.randomUUID();
        Document revokedDocument = new Document(revokedDocumentId, "path",
                "iv".getBytes(StandardCharsets.UTF_8), Instant.parse("2026-12-03T10:15:30.00Z"), Instant.parse("2025-12-03T10:15:30.00Z"));
        documentRepository.save(revokedDocument);


        // THEN
        Assertions.assertThatThrownBy(() -> documentService.find(revokedDocumentId))
                .isExactlyInstanceOf(DocumentAccessRevokedException.class)
                .hasMessage(DocumentNotFoundException.DOCUMENT_NOT_FOUND);
    }

    @Test
    void find_getDocumentFromCache_whenHitsCache(@TempDir Path path) {
        // GIVEN
        UUID documentId = UUID.randomUUID();
        String fileName = documentId.toString();
        URI blobLocation = blobStorage.store(path, fileName, "test".getBytes(StandardCharsets.UTF_8));
        DocumentCacheEntry documentCacheEntry = new DocumentCacheEntry(blobLocation.getPath(), "iv".getBytes(StandardCharsets.UTF_8), false);
        documentCache.put(fileName, documentCacheEntry, Duration.ofMinutes(3L));

        // WHEN
        StoredDocument result = documentService.find(documentId);

        // THEN
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.encryptedBlob()).isNotNull();
        Assertions.assertThat(result.iv()).isNotNull();
    }

    @Test
    void find_throwsDocumentNotFoundException_whenHitsCacheAndFileNotFound() {
        // GIVEN
        UUID documentId = UUID.randomUUID();
        DocumentCacheEntry documentCacheEntry = new DocumentCacheEntry("/", "iv".getBytes(StandardCharsets.UTF_8), false);
        documentCache.put(documentId.toString(), documentCacheEntry, Duration.ofMinutes(3L));

        // THEN
        Assertions.assertThatThrownBy(() -> documentService.find(documentId))
                .isExactlyInstanceOf(DocumentNotFoundException.class)
                .hasMessage("Document can't be found");
    }

    @Test
    void store_persistsDocumentToFileSystem_whenSuccessful() {
        // GIVEN
        EncryptedDocument document = new EncryptedDocument("test".getBytes(StandardCharsets.UTF_8), "iv".getBytes(StandardCharsets.UTF_8));
        DocumentIdentity identity = documentService.store(document);

        // WHEN
        Document result = documentRepository.findById(identity.id()).orElseThrow();

        // THEN
        Assertions.assertThat(Files.exists(Paths.get(result.blobPath()))).isTrue();
        Assertions.assertThat(result.identity()).isEqualTo(identity.id());
    }

    @Test
    void store_setsDefaultDocumentExpirationDate_whenSuccessful() {
        // GIVEN
        EncryptedDocument encryptedDocument = new EncryptedDocument("test".getBytes(StandardCharsets.UTF_8), "iv".getBytes(StandardCharsets.UTF_8));
        TemporalUnitWithinOffset withAcceptableOffset = new TemporalUnitWithinOffset(2, ChronoUnit.MINUTES);
        DocumentIdentity documentIdentity = documentService.store(encryptedDocument);

        // WHEN
        Document result = documentRepository.findById(documentIdentity.id()).orElseThrow();


        // THEN
        Instant validityPeriod = Instant.now().plus(Duration.of(TEST_VALIDITY_DAYS, ChronoUnit.DAYS));
        Assertions.assertThat(result.expiresAt()).isCloseTo(validityPeriod, withAcceptableOffset);
    }

    @Test
    void store_cachesDocument_whenSuccessful() {
        // GIVEN
        EncryptedDocument document = new EncryptedDocument("test".getBytes(StandardCharsets.UTF_8), "iv".getBytes(StandardCharsets.UTF_8));
        DocumentIdentity identity = documentService.store(document);

        // WHEN
        DocumentCacheEntry result = documentCache.get(identity.id().toString()).orElseThrow();

        // THEN
        Assertions.assertThat(result.fileLocation()).endsWith(identity.id().toString());
        Assertions.assertThat(result.isRevoked()).isFalse();
    }

    @Test
    void revoke_markDocumentAsRevoked_whenSuccessful() {
        // GIVEN
        UUID documentId = UUID.randomUUID();
        Document document = new Document(documentId, "path",
                "iv".getBytes(StandardCharsets.UTF_8), Instant.parse("2026-12-03T10:15:30.00Z"));
        documentRepository.save(document);

        // WHEN
        documentService.revoke(documentId);

        // THEN
        Document result = documentRepository.findById(documentId).orElseThrow();
        Assertions.assertThat(result.isRevoked()).isTrue();
    }

    @Test
    void revoke_evictsDocumentFromCache_whenExists(@TempDir Path path) {
        // GIVEN
        UUID documentId = UUID.randomUUID();
        DocumentCacheEntry cacheEntry = new DocumentCacheEntry(path.toString(), "".getBytes(StandardCharsets.UTF_8), true);
        documentCache.put(documentId.toString(), cacheEntry, Duration.of(1L, ChronoUnit.DAYS));


        // WHEN
        documentService.revoke(documentId);

        // THEN
        Optional<DocumentCacheEntry> result = documentCache.get(documentId.toString());
        Assertions.assertThat(result).isEmpty();
    }
}