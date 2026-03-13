package dev.silentcraft.sigil.fake;

import java.util.UUID;

import dev.silentcraft.sigil.domain.service.DocumentService;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

public class FakeDocumentService extends DocumentService {


    public FakeDocumentService(FakeDocumentRepository documentRepository) {
        super(documentRepository, "");
    }

    @Override
    public StoredDocument store(EncryptedDocument encryptedDocument) {
        return new StoredDocument(UUID.fromString("00000000-0000-0000-0000-000000000001"));
    }

}
