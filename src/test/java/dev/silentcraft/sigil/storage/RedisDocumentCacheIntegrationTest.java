package dev.silentcraft.sigil.storage;


import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.silentcraft.sigil.domain.valueobject.DocumentCacheEntry;

@Testcontainers
@Tag("IntegrationTests")
@Transactional
class RedisDocumentCacheIntegrationTest {

    @Container
    private static final GenericContainer<?> redis = new GenericContainer<>("redis:8.6-alpine")
            .withExposedPorts(6379);

    private RedisTemplate<String, String> redisTemplate;
    private RedisDocumentCache cache;
    private ObjectMapper mapper;


    @BeforeEach
    void setup() {
        LettuceConnectionFactory connectionFactory = new LettuceConnectionFactory(redis.getHost(), redis.getMappedPort(6379));
        connectionFactory.start();
        redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(connectionFactory);
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        redisTemplate.afterPropertiesSet();

        mapper = new ObjectMapper();
        cache = new RedisDocumentCache(redisTemplate, mapper);
    }

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.redis.host", redis::getHost);
        registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379));
    }

    @Test
    void get_retrievesDocumentCacheEntry_whenSuccessful() {
        // GIVEN
        String documentCacheKey = UUID.randomUUID().toString();
        DocumentCacheEntry cacheEntry = new DocumentCacheEntry("/path/to/blob", new byte[0], false);
        cache.put(documentCacheKey, cacheEntry, Duration.ofDays(1));

        // WHEN
        DocumentCacheEntry result = cache.get(documentCacheKey).orElseThrow();

        // THEN
        Assertions.assertThat(result.fileLocation()).isEqualTo(cacheEntry.fileLocation());
        Assertions.assertThat(result.isRevoked()).isEqualTo(cacheEntry.isRevoked());
    }

    @Test
    void get_returnsEmpty_whenCacheTimedOut() throws InterruptedException {
        String documentCacheKey = UUID.randomUUID().toString();
        DocumentCacheEntry cacheEntry = new DocumentCacheEntry("/path/to/blob", new byte[0], false);
        cache.put(documentCacheKey, cacheEntry, Duration.ofMillis(1L));
        waitForTimeout();

        // WHEN
        Optional<DocumentCacheEntry> result = cache.get(documentCacheKey);

        // THEN
        Assertions.assertThat(result).isEmpty();
    }

    private void waitForTimeout() throws InterruptedException {
        Thread.sleep(10);
    }

}