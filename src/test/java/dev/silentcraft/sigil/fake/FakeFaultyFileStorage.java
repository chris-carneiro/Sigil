package dev.silentcraft.sigil.fake;

import java.net.URI;
import java.nio.file.Path;

import dev.silentcraft.sigil.domain.error.BlobStorageException;
import dev.silentcraft.sigil.domain.repository.BlobStorage;

public class FakeFaultyFileStorage implements BlobStorage {
    @Override
    public URI store(Path dir, byte[] content, String fileName) {
        throw new BlobStorageException();

    }
}
