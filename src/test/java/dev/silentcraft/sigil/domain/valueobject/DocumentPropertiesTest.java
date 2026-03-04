package dev.silentcraft.sigil.domain.valueobject;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import dev.silentcraft.sigil.domain.error.DocumentReadException;
import dev.silentcraft.sigil.fake.FakeUnreadableMultipartFile;

class DocumentPropertiesTest {

    @Test
    void from_returnsDocumentProperties_whenMultipartFileIsValid() {
        MockMultipartFile file = new MockMultipartFile(
                "document", "report.pdf",
                MediaType.APPLICATION_PDF_VALUE, "content".getBytes());

        DocumentProperties result = DocumentProperties.from(file);

        assertThat(result.fileName()).isEqualTo("report.pdf");
        assertThat(result.blob()).isEqualTo("content".getBytes());
    }

    @Test
    void from_throwsDocumentReadException_whenBytesCannotBeRead() {
        MultipartFile file = new FakeUnreadableMultipartFile("aName", null);

        assertThatThrownBy(() -> DocumentProperties.from(file))
                .isInstanceOf(DocumentReadException.class);
    }

    @Test
    void fileSize_returnsFileSize_whenBlobIsNotEmpty() {
        //GIVEN
        DocumentProperties properties = new DocumentProperties("small.file", "four".getBytes(StandardCharsets.UTF_8));

        //WHEN
        var result = properties.fileSize();

        //THEN
        assertThat(result).isEqualTo(4L);
    }
}