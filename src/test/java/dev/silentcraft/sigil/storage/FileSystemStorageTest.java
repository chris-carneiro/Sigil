package dev.silentcraft.sigil.storage;


import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import dev.silentcraft.sigil.domain.error.BlobStorageException;
import dev.silentcraft.sigil.domain.repository.BlobStorage;

class FileSystemStorageTest {

    @Test
    void store_returnsURI_whenSuccessful(@TempDir Path dir) {
        // GIVEN
        BlobStorage fileSystemStorage = new FileSystemStorage();
        UUID fileName = UUID.randomUUID();
        // WHEN
        URI result = fileSystemStorage.store(dir, fileName.toString(), "encryptedContent".getBytes(StandardCharsets.UTF_8));

        // THEN
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.toString()).endsWith(fileName.toString());
    }

    @Test
    void store_throwsBlobStorageException_whenErrorOccurs(@TempDir Path dir) {
        // GIVEN
        BlobStorage faultyBlobStorage = new FileSystemStorage();
        String fileName = UUID.randomUUID().toString();
        dir.toFile().setReadOnly(); // triggers IOException by making the path readonly

        // WHEN & THEN
        Assertions.assertThatThrownBy(() -> faultyBlobStorage.store(dir, fileName, new byte[0]))
                .isExactlyInstanceOf(BlobStorageException.class)
                .hasMessage("The document could not be stored. Please try again later.");
    }

    @Test
    void read_returnBlobContent_whenSuccessful(@TempDir Path dir) {
        //GIVEN
        BlobStorage fileSystemStorage = new FileSystemStorage();
        URI tempFile = fileSystemStorage.store(dir, "aTempFile", "content-text".getBytes(StandardCharsets.UTF_8));


        // WHEN
        byte[] result = fileSystemStorage.read(Paths.get(tempFile));

        // THEN
        Assertions.assertThat(result).isEqualTo("content-text".getBytes(StandardCharsets.UTF_8));
    }

    @Test
    void read_throwsBlobStorageException_whenErrorOccurs() {

        BlobStorage faultyBlobStorage = new FileSystemStorage();
        Path unAccessibleFile = Paths.get(URI.create("file:///unAccessibleFile.txt"));

        // THEN
        Assertions.assertThatThrownBy(() -> faultyBlobStorage.read(unAccessibleFile))
                .isExactlyInstanceOf(BlobStorageException.class)
                .hasMessage("The document you are trying to reach can't be accessed right now. Please try again later.");
    }

}