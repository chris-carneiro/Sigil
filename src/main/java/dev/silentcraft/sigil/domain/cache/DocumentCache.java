package dev.silentcraft.sigil.domain.cache;

import java.util.Optional;

import dev.silentcraft.sigil.domain.valueobject.DocumentCacheEntry;

public interface DocumentCache {
    void put(String key, DocumentCacheEntry entry);

    Optional<DocumentCacheEntry> get(String key);
}
