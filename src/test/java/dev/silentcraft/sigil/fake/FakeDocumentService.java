package dev.silentcraft.sigil.fake;

import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.UUID;

import dev.silentcraft.sigil.domain.service.DocumentService;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.DocumentIdentity;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

public class FakeDocumentService extends DocumentService {


    public FakeDocumentService(FakeDocumentRepository documentRepository) {
        super(documentRepository, "");
    }

    @Override
    public DocumentIdentity store(EncryptedDocument encryptedDocument) {
        return new DocumentIdentity(UUID.fromString("00000000-0000-0000-0000-000000000001"));
    }

    @Override
    public StoredDocument find(UUID identity) {
        return new StoredDocument(
                "encryptedBlob".getBytes(StandardCharsets.UTF_8),
                "iv".getBytes(StandardCharsets.UTF_8),
                "fileName",
                "mimeType"
        );
    }


}
