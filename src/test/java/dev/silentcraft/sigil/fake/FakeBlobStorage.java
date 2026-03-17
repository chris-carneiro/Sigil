package dev.silentcraft.sigil.fake;

import java.net.URI;
import java.nio.file.Path;

import dev.silentcraft.sigil.domain.repository.BlobStorage;

public class FakeBlobStorage implements BlobStorage {
    @Override
    public URI store(Path dir, String fileName, byte[] content) {
        return URI.create("file:///fake");
    }

    @Override
    public byte[] read(Path path) {
        return new byte[0];
    }
}
