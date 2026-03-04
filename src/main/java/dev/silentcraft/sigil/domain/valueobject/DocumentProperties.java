package dev.silentcraft.sigil.domain.valueobject;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import dev.silentcraft.sigil.domain.error.DocumentReadException;

public record DocumentProperties(String fileName, byte[] blob) {

    public static DocumentProperties from(MultipartFile multipartFile) {
        // TODO Phase 2: add mimeType from explicit request field
        // getContentType() will return application/octet-stream after encryption
        try {
            return new DocumentProperties(
                    multipartFile.getOriginalFilename(),
                    multipartFile.getBytes()
            );
        } catch (IOException e) {
            throw new DocumentReadException(DocumentReadException.UNREADABLE_DOCUMENT);
        }
    }

    public long fileSize() {
        return blob.length;
    }
}
