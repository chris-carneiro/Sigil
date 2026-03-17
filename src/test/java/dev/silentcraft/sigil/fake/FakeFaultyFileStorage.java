package dev.silentcraft.sigil.fake;

import java.net.URI;
import java.nio.file.Path;

import dev.silentcraft.sigil.domain.error.BlobStorageException;
import dev.silentcraft.sigil.domain.repository.BlobStorage;

public class FakeFaultyFileStorage implements BlobStorage {
    @Override
    public URI store(Path dir, String fileName, byte[] content) {
        throw new BlobStorageException(BlobStorageException.CANT_STORE_DOCUMENT);

    }

    @Override
    public byte[] read(Path path) {
        throw new UnsupportedOperationException("TODO implement read method");
    }
}
