package dev.silentcraft.sigil.domain.valueobject;

import java.util.Arrays;

public record EncryptedDocument(String fileName, String mimeType, byte[] encryptedFile, byte[] fileIv) {

    public EncryptedDocument {
        encryptedFile = Arrays.copyOf(encryptedFile, encryptedFile.length);
        fileIv = Arrays.copyOf(fileIv, fileIv.length);
    }

    public long fileSize() {
        return encryptedFile.length;
    }
}
