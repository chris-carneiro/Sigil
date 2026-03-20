package dev.silentcraft.sigil.domain.service;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import dev.silentcraft.sigil.domain.error.BlobStorageException;
import dev.silentcraft.sigil.domain.repository.DocumentRepository;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.fake.FakeFaultyFileStorage;

@SpringBootTest
@Testcontainers
@Tag("IntegrationTests")
@Import(FaultyStorageTestConfig.class)
public class FileStorageRollbackIntegrationTest {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private FakeFaultyFileStorage blobStorage;

    @TempDir
    private static Path tempDir;

    @Container
    private static PostgreSQLContainer<?> postgresDB = new PostgreSQLContainer<>("postgres:15.17")
            .withDatabaseName("test-sigil-db")
            .withUsername("test-user")
            .withPassword("test-user");


    @DynamicPropertySource
    static void setPostgresDB(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgresDB::getJdbcUrl);
        registry.add("spring.datasource.username", postgresDB::getUsername);
        registry.add("spring.datasource.password", postgresDB::getPassword);
        registry.add("sigil.document.location.path", () -> tempDir.toString());
    }

    @Test
    void store_rollbacks_whenDocumentCantBeStoredToFileSystem() {

        // GIVEN
        try {
            EncryptedDocument document = new EncryptedDocument("test".getBytes(StandardCharsets.UTF_8), "iv".getBytes(StandardCharsets.UTF_8));
            documentService.store(document);
        } catch (BlobStorageException ex) {
            // WHEN
            long result = documentRepository.count();

            Assertions.assertThat(result).isZero();
        }
    }
}
