package dev.silentcraft.sigil.domain.error;

import java.io.Serial;

public class BlobStorageException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = -9107921479022041551L;
    public static final String CANT_STORE_DOCUMENT = "The document could not be stored. Please try again later.";
    public static final String CANT_READ_DOCUMENT = "The document you are trying to reach can't be accessed right now. Please try again later.";

    public BlobStorageException() {
        super(CANT_STORE_DOCUMENT);
    }

    public BlobStorageException(String message) {
        super(message);
    }
}
