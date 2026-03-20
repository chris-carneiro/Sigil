package dev.silentcraft.sigil.api.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import dev.silentcraft.sigil.fake.FakeDocumentService;
import dev.silentcraft.sigil.fake.FakeUnreadableMultipartFile;

@WebMvcTest(DocumentController.class)
@Import(TestConfig.class)
class DocumentControllerTest {

    @Autowired
    MockMvc mockMvc;


    @Test
    void uploadDocument_returnsCreated_whenRequestSuccessful() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "document", "file.txt",
                MediaType.TEXT_PLAIN_VALUE, "bar".getBytes(StandardCharsets.UTF_8));
        MockMultipartFile fileIv = new MockMultipartFile(
                "iv", "ivFile",
                MediaType.APPLICATION_OCTET_STREAM_VALUE, "bar".getBytes(StandardCharsets.UTF_8));


        mockMvc.perform(multipart("/api/v1/documents")
                        .file(file)
                        .file(fileIv)
                        .characterEncoding("UTF_8"))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(header().string("Location",
                        "/api/v1/documents/00000000-0000-0000-0000-000000000001"))
                .andExpect(jsonPath("$.documentId").exists())
                .andExpect(jsonPath("$.documentId")
                        .value("00000000-0000-0000-0000-000000000001"));
    }

    @Test
    void uploadDocument_returns400_whenFileIsEmpty() throws Exception {
        MockMultipartFile emptyFile = new MockMultipartFile(
                "document",
                "empty.txt",
                MediaType.TEXT_PLAIN_VALUE,
                new byte[0]);

        MockMultipartFile fileIv = new MockMultipartFile(
                "iv", "ivFile",
                MediaType.APPLICATION_OCTET_STREAM_VALUE, "bar".getBytes(StandardCharsets.UTF_8));

        mockMvc.perform(multipart("/api/v1/documents")
                        .file(emptyFile)
                        .file(fileIv))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Document must not be empty."));
    }

    @Test
    void uploadDocument_return400_whenFileNotProvided() throws Exception {
        mockMvc.perform(multipart("/api/v1/documents"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Required field 'document' is missing."));
    }

    @Test
    void uploadDocument_returns500_whenFileIsUnreadable() throws Exception {
        MockMultipartFile unreadableMultipartFile = new FakeUnreadableMultipartFile("document", "bar".getBytes(StandardCharsets.UTF_8));
        MockMultipartFile fileIv = new MockMultipartFile(
                "iv", "ivFile",
                MediaType.APPLICATION_OCTET_STREAM_VALUE, "bar".getBytes(StandardCharsets.UTF_8));
        mockMvc.perform(multipart("/api/v1/documents")
                        .file(unreadableMultipartFile)
                        .file(fileIv))
                .andExpect(status().is5xxServerError())
                .andExpect(jsonPath("$.message")
                        .value("Failed to process document."));
    }


    @Test
    void uploadDocument_return503_whenDocumentCantBeStored() throws Exception {
        MockMultipartFile cantBeStored = new MockMultipartFile(
                "document", "blob",
                MediaType.TEXT_PLAIN_VALUE, "trigger_BlobStorageException".getBytes(StandardCharsets.UTF_8));

        MockMultipartFile fileIv = new MockMultipartFile(
                "iv", "ivFile",
                MediaType.APPLICATION_OCTET_STREAM_VALUE, "bar".getBytes(StandardCharsets.UTF_8));

        mockMvc.perform(multipart("/api/v1/documents")
                        .file(cantBeStored)
                        .file(fileIv))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.message")
                        .value("The document could not be stored. Please try again later."));


    }


    @Test
    void downloadDocument_returnsOk_whenRequestSuccessful() throws Exception {
        // GIVEN
        UUID documentId = FakeDocumentService.FAKE_DOCUMENT_UUID;
        URI documentResource = URI.create("/api/v1/documents/%s".formatted(documentId));

        // WHEN
        mockMvc.perform(get(documentResource))
                .andExpect(status().isOk())
                .andExpect(header().exists("encryption-metadata-iv"))
                .andExpect(content().contentType(MediaType.APPLICATION_OCTET_STREAM_VALUE));
    }

    @Test
    void downloadDocument_returnNotFound_whenDocumentIsNotFound() throws Exception {
        // GIVEN
        UUID documentId = UUID.randomUUID();
        URI documentResource = URI.create("/api/v1/documents/%s".formatted(documentId));

        // WHEN
        mockMvc.perform(get(documentResource))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message")
                        .value("Document can't be found"));
    }

    @Test
    void downloadDocument_returnNotFound_whenDocumentIsRevoked() throws Exception {
        // GIVEN
        UUID documentId = FakeDocumentService.FAKE_REVOKED_DOCUMENT_UUID;
        URI documentResource = URI.create("/api/v1/documents/%s".formatted(documentId));

        // WHEN
        mockMvc.perform(get(documentResource))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message")
                        .value("Document can't be found"));
    }

}