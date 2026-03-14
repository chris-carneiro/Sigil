package dev.silentcraft.sigil.fake;

import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.UUID;

import dev.silentcraft.sigil.domain.error.DocumentNotFoundException;
import dev.silentcraft.sigil.domain.service.DocumentService;
import dev.silentcraft.sigil.domain.valueobject.DocumentIdentity;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

public class FakeDocumentService extends DocumentService {


    public FakeDocumentService(FakeDocumentRepository documentRepository) {
        super(documentRepository, "");
    }

    @Override
    public DocumentIdentity store(EncryptedDocument encryptedDocument) {
        return new DocumentIdentity(UUID.fromString(FakeDocumentRepository.FAKE_DOCUMENT_ID));
    }

    @Override
    public StoredDocument find(UUID identity) {
        if (Objects.equals(identity, UUID.fromString(FakeDocumentRepository.FAKE_DOCUMENT_ID))) {
            return new StoredDocument(
                    "encryptedBlob".getBytes(StandardCharsets.UTF_8),
                    "iv".getBytes(StandardCharsets.UTF_8),
                    "fileName",
                    "mimeType"
            );
        }
        throw new DocumentNotFoundException();
    }
}
