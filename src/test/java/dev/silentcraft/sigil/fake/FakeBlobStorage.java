package dev.silentcraft.sigil.fake;

import java.net.URI;
import java.nio.file.Path;

import dev.silentcraft.sigil.domain.repository.BlobStorage;

public class FakeBlobStorage implements BlobStorage {
    @Override
    public URI store(Path dir, byte[] content, String fileName) {
        return URI.create("file:///fake");
    }
}
