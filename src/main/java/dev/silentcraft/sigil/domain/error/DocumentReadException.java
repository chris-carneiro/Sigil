package dev.silentcraft.sigil.domain.error;

import java.io.Serial;

public class DocumentReadException extends RuntimeException {
    public static final String UNREADABLE_DOCUMENT = "Failed to process document.";

    @Serial
    private static final long serialVersionUID = -2872376724019306958L;


    public DocumentReadException(String message) {
        super(message);
    }
}
