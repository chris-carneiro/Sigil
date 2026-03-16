package dev.silentcraft.sigil.storage;


import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

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

        // WHEN
        URI result = fileSystemStorage.store(dir, "encryptedContent".getBytes(StandardCharsets.UTF_8));

        // THEN
        Assertions.assertThat(result).isNotNull();
        Assertions.assertThat(result.getPath()).isNotNull();
    }

    @Test
    void store_throwsBlobStorageException_whenErrorOccured(@TempDir Path dir) {
        // GIVEN
        BlobStorage faultyBlobStorage = new FileSystemStorage();
        dir.toFile().setReadOnly(); // triggers IOException by making the path readonly

        // WHEN & THEN
        Assertions.assertThatThrownBy(() -> faultyBlobStorage.store(dir, new byte[0]))
                .isExactlyInstanceOf(BlobStorageException.class)
                .hasMessage("The document could not be stored. Please try again later");
    }

}