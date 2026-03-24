package dev.silentcraft.sigil.domain.valueobject;

import java.nio.file.Path;

public record ResolvedDocument(Path fileLocation, byte[] iv, boolean revoked) {
}
