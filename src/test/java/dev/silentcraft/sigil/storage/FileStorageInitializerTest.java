package dev.silentcraft.sigil.storage;

import java.nio.file.Files;
import java.nio.file.Path;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest(classes = FileStorageInitializer.class)
class FileStorageInitializerTest {

    private static final Path TEST_STORAGE_PATH = Path.of("/tmp/.sigil/test");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("sigil.document.location.path", TEST_STORAGE_PATH::toString);
    }

    @Test
    void run_createsStoragePath_whenDoesNotExist() {
        Assertions.assertThat(Files.exists(Path.of("/tmp/.sigil/test"))).isTrue();
    }

}