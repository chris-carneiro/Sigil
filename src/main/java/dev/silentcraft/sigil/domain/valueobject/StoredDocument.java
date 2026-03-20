package dev.silentcraft.sigil.domain.valueobject;

import java.util.Arrays;
import java.util.Objects;

public record StoredDocument(byte[] encryptedBlob, byte[] iv) {
    public StoredDocument {
        byte[] safeEncryptedBlob = Objects.requireNonNull(encryptedBlob, "StoredDocument - encryptedBlob can't be null");
        byte[] safeIv = Objects.requireNonNull(iv, "StoredDocument - iv can't be null");

        encryptedBlob = Arrays.copyOf(safeEncryptedBlob, encryptedBlob.length);
        iv = Arrays.copyOf(safeIv, iv.length);
    }
}
