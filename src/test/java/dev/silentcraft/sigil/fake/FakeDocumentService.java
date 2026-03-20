package dev.silentcraft.sigil.fake;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

import dev.silentcraft.sigil.domain.error.BlobStorageException;
import dev.silentcraft.sigil.domain.error.DocumentAccessRevokedException;
import dev.silentcraft.sigil.domain.error.DocumentNotFoundException;
import dev.silentcraft.sigil.domain.repository.BlobStorage;
import dev.silentcraft.sigil.domain.repository.DocumentRepository;
import dev.silentcraft.sigil.domain.service.DocumentService;
import dev.silentcraft.sigil.domain.valueobject.DocumentIdentity;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

public class FakeDocumentService extends DocumentService {

    public static final String FAKE_DOCUMENT_ID = "00000000-0000-0000-0000-000000000001";
    public static final String FAKE_REVOKED_DOCUMENT_ID = "00000000-0000-0000-0000-000000000002";
    public static final UUID FAKE_DOCUMENT_UUID = UUID.fromString(FAKE_DOCUMENT_ID);
    public static final UUID FAKE_REVOKED_DOCUMENT_UUID = UUID.fromString(FAKE_REVOKED_DOCUMENT_ID);
    private static final byte[] TRIGGER_BLOB_STORAGE_EXCEPTION = "trigger_BlobStorageException".getBytes(StandardCharsets.UTF_8);

    public FakeDocumentService(DocumentRepository documentRepository, BlobStorage blobStorage) {
        super(documentRepository, "", blobStorage);
    }

    @Override
    public DocumentIdentity store(EncryptedDocument encryptedDocument) {
        if (Arrays.equals(TRIGGER_BLOB_STORAGE_EXCEPTION, encryptedDocument.encryptedFile())) {
            throw new BlobStorageException(BlobStorageException.CANT_STORE_DOCUMENT);
        }
        return new DocumentIdentity(FAKE_DOCUMENT_UUID);
    }

    @Override
    public StoredDocument find(UUID identity) {
        if (Objects.equals(identity, FAKE_DOCUMENT_UUID)) {
            return new StoredDocument(
                    "encryptedBlob".getBytes(StandardCharsets.UTF_8),
                    "iv".getBytes(StandardCharsets.UTF_8)
            );
        }

        if (Objects.equals(identity, FAKE_REVOKED_DOCUMENT_UUID)) {
            throw new DocumentAccessRevokedException();
        }

        throw new DocumentNotFoundException();
    }
}
