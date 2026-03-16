package dev.silentcraft.sigil.domain.repository;

import java.net.URI;
import java.nio.file.Path;

import dev.silentcraft.sigil.domain.error.BlobStorageException;

public interface BlobStorage {
    URI store(Path dir, byte[] content) throws BlobStorageException;
}
