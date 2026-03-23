# 0003 — Redis manual integration over Spring data

## Status

Accepted

## Context
Redis was already chosen as the caching layer.
There were 2 possible approaches to integrating Redis. Wiring up manually by instantiating a RedisTemplate bean and its deps or leaving that to Spring Data and turning the Cache entry into a mutable entity handled by a CRUDRepository.

## Decision
The manual approach was chosen for 4 reasons: 
- The Document cache entry object immutability
- Redis doesn't participate in JPA transactions by design, so a rollback of the DB write would not roll back a cache put - Spring Data doesn't add that feature either. So that didn't account as a reason to favor the Spring Data approach.
- The save() CRUDRepository method would have added complexity to set a TTL a cached entry.
- The package structure was less obvious.

## Consequences
- The RedisTemplate is defined and instantiated inside a storage/StorageConfiguration spring Configuration.
- The driving interface responsible for boundary setting has its own domain/cache package. 
- The implementation sits in the infra /storage package along with other storage-responsible objects
- The DocumentCacheEntry is an immutable record
- The TTL duration can be set directly when storing entry into cache.



