package dev.silentcraft.sigil.api.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

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

        mockMvc.perform(multipart("/api/v1/documents")
                        .file(file)
                        .characterEncoding("UTF_8"))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(header().string("Location",
                        "/api/v1/documents/00000000-0000-0000-0000-000000000001"));
    }

    @Test
    void uploadDocument_returns400_whenFileIsEmpty() throws Exception {
        MockMultipartFile emptyFile = new MockMultipartFile(
                "document",
                "empty.txt",
                MediaType.TEXT_PLAIN_VALUE,
                new byte[0]);

        mockMvc.perform(multipart("/api/v1/documents")
                        .file(emptyFile))
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
        MockMultipartFile unreadableMultipartFile = new FakeUnreadableMultipartFile("document","bar".getBytes(StandardCharsets.UTF_8));

        mockMvc.perform(multipart("/api/v1/documents")
                        .file(unreadableMultipartFile))
                .andExpect(status().is5xxServerError())
                .andExpect(jsonPath("$.message")
                        .value("Failed to process document."));
    }
}