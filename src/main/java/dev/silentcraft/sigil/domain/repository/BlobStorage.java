package dev.silentcraft.sigil.domain.repository;

import java.net.URI;
import java.nio.file.Path;

public interface BlobStorage {
    URI store(Path dir, byte[] content, String fileName);
}
