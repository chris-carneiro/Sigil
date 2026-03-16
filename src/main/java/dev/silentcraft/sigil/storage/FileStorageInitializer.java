package dev.silentcraft.sigil.storage;


import java.nio.file.Files;
import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class FileStorageInitializer implements CommandLineRunner {

    private final Path storagePath;

    public FileStorageInitializer(@Value("${sigil.document.location.path}") String locationPath) {
        storagePath = Path.of(locationPath);
    }

    @Override
    public void run(String... args) throws Exception {
        Files.createDirectories(storagePath);
    }
}
