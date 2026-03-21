package dev.silentcraft.sigil.storage;

import java.time.Duration;
import java.util.Objects;
import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.silentcraft.sigil.domain.cache.DocumentCache;
import dev.silentcraft.sigil.domain.valueobject.DocumentCacheEntry;

@Repository
public class RedisDocumentCache implements DocumentCache {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper jsonMapper;

    public RedisDocumentCache(RedisTemplate<String, String> redisTemplate, ObjectMapper jsonMapper) {
        this.redisTemplate = redisTemplate;
        this.jsonMapper = jsonMapper;
    }
    
    @Override
    public void put(String key, DocumentCacheEntry entry, Duration cacheTimeout) {
        try {
            redisTemplate.opsForValue().set(key, jsonMapper.writeValueAsString(entry), cacheTimeout);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<DocumentCacheEntry> get(String key) {
        try {
            String value = redisTemplate.opsForValue().get(key);

            if (Objects.nonNull(value)) {
                return Optional.of(jsonMapper.readValue(value, DocumentCacheEntry.class));
            }

        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
        return Optional.empty();
    }
}
