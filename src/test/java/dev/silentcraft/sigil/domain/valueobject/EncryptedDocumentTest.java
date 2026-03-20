package dev.silentcraft.sigil.domain.valueobject;

import static org.assertj.core.api.Assertions.assertThat;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;

class EncryptedDocumentTest {

    @Test
    void fileSize_returnsFileSize_whenBlobIsNotEmpty() {
        //GIVEN
        EncryptedDocument properties = new EncryptedDocument("four".getBytes(StandardCharsets.UTF_8), "".getBytes(StandardCharsets.UTF_8));

        //WHEN
        var result = properties.fileSize();

        //THEN
        assertThat(result).isEqualTo(4L);
    }
}