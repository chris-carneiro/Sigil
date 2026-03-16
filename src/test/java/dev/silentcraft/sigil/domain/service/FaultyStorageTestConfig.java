package dev.silentcraft.sigil.domain.service;

import org.springframework.context.annotation.Bean;

import dev.silentcraft.sigil.domain.repository.BlobStorage;
import dev.silentcraft.sigil.fake.FakeFaultyFileStorage;

public class FaultyStorageTestConfig {

    @Bean
    public BlobStorage blobStorage() {
        return new FakeFaultyFileStorage();
    }
}
