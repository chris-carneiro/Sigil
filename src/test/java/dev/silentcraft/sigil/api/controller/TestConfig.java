package dev.silentcraft.sigil.api.controller;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

import dev.silentcraft.sigil.domain.service.DocumentService;
import dev.silentcraft.sigil.fake.FakeDocumentRepository;
import dev.silentcraft.sigil.fake.FakeDocumentService;

@TestConfiguration
public class TestConfig {

    @Bean
    public FakeDocumentRepository documentRepository() {
        return new FakeDocumentRepository();
    }

    @Bean
    public DocumentService documentService(FakeDocumentRepository documentRepository) {
        return new FakeDocumentService(documentRepository);
    }
}
