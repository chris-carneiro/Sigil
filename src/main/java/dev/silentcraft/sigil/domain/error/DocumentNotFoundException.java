package dev.silentcraft.sigil.domain.error;

import java.io.Serial;

public class DocumentNotFoundException extends RuntimeException {
    public static final String DOCUMENT_NOT_FOUND = "Document can't be found";

    @Serial
    private static final long serialVersionUID = -1143947428873098977L;

    public DocumentNotFoundException() {
        super(DOCUMENT_NOT_FOUND);
    }
}
