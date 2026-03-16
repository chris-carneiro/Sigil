package dev.silentcraft.sigil.storage;

import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.nio.file.StandardOpenOption;

import org.springframework.stereotype.Component;

import dev.silentcraft.sigil.domain.error.BlobStorageException;
import dev.silentcraft.sigil.domain.repository.BlobStorage;

@Component
public class FileSystemStorage implements BlobStorage {
    @Override
    public URI store(Path dir, byte[] content, String fileName) {
        try {
            Path tempFile = Files.createTempFile(dir, null, null);
            Path filePath = Files.write(tempFile.toAbsolutePath(), content, StandardOpenOption.WRITE);
            Path finalPath = dir.resolve(fileName);

            Path file = Files.move(filePath, finalPath, StandardCopyOption.ATOMIC_MOVE);
            return file.toUri();
        } catch (IOException e) {
            throw new BlobStorageException();
        }
    }
}
