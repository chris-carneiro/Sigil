package dev.silentcraft.sigil.domain.valueobject;

import java.util.Arrays;

public record EncryptedDocument(String fileName, byte[] encryptedFile, byte[] fileIv) {

    static byte[] copy(byte... bytes) {
        return Arrays.copyOf(bytes, bytes.length);
    }

    public long fileSize() {
        return copy(encryptedFile).length;
    }
}
