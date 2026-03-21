package dev.silentcraft.sigil.storage;

import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.silentcraft.sigil.domain.cache.DocumentCache;
import dev.silentcraft.sigil.domain.valueobject.DocumentCacheEntry;

public class RedisDocumentCache implements DocumentCache {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper jsonMapper;


    public RedisDocumentCache(RedisTemplate<String, String> redisTemplate, ObjectMapper jsonMapper) {
        this.redisTemplate = redisTemplate;
        this.jsonMapper = jsonMapper;
    }

    @Override
    public void put(String key, DocumentCacheEntry entry) {
        try {
            redisTemplate.opsForValue().set(key, jsonMapper.writeValueAsString(entry));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Optional<DocumentCacheEntry> get(String key) {
        try {
            String cacheStringValue = redisTemplate.opsForValue().get(key);

            return Optional.of(jsonMapper.readValue(cacheStringValue, DocumentCacheEntry.class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
