package dev.silentcraft.sigil.domain.service;

import java.nio.charset.StandardCharsets;
import java.nio.file.NoSuchFileException;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

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
    }

    @Test
    void store_returnsStoredDocument_whenSuccessful() {
        // GIVEN
        EncryptedDocument properties = new EncryptedDocument("aFile.txt", "test".getBytes(StandardCharsets.UTF_8), "iv".getBytes(StandardCharsets.UTF_8));

        // WHEN
        DocumentIdentity result = documentService.store(properties);

        // THEN
        Assertions.assertThat(result).isNotNull();
    }

    @Test
    void find_returnsStoredDocument_whenDocumentExists() throws NoSuchFileException {
        // GIVEN
        EncryptedDocument encryptedDocument = new EncryptedDocument("aFile.txt", "test".getBytes(StandardCharsets.UTF_8), "iv".getBytes(StandardCharsets.UTF_8));
        DocumentIdentity document = documentService.store(encryptedDocument);
        // WHEN
        StoredDocument result = documentService.find(document.id());
        // THEN

        Assertions.assertThat(result)
                .extracting(StoredDocument::fileName)
                .isEqualTo(encryptedDocument.fileName());
    }

}