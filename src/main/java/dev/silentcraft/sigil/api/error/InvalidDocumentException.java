package dev.silentcraft.sigil.api.error;

import java.io.Serial;

public class InvalidDocumentException extends RuntimeException {
    public static final String EMPTY_DOCUMENT = "Document must not be empty.";

    @Serial
    private static final long serialVersionUID = -2710159528846805657L;

    public InvalidDocumentException(String message) {
        super(message);
    }
}
