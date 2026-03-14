package dev.silentcraft.sigil.domain.valueobject;

import java.util.Arrays;

public record StoredDocument(byte[] encryptedBlob, byte[] iv, String fileName, String mimeType) {
    public StoredDocument {
        encryptedBlob = Arrays.copyOf(encryptedBlob, encryptedBlob.length);
        iv = Arrays.copyOf(iv, iv.length);
    }

}
