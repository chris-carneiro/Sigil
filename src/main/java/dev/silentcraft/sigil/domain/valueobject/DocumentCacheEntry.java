package dev.silentcraft.sigil.domain.valueobject;

public record DocumentCacheEntry(String fileLocation, byte[] iv, boolean isRevoked) {
}
