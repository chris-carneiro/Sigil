package dev.silentcraft.sigil.domain.cache;

import java.time.Duration;
import java.util.Optional;

import dev.silentcraft.sigil.domain.valueobject.DocumentCacheEntry;

public interface DocumentCache {
    void put(String key, DocumentCacheEntry entry, Duration cacheTimeout);

    Optional<DocumentCacheEntry> get(String key);
}
