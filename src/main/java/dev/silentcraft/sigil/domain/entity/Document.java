package dev.silentcraft.sigil.domain.entity;

import java.time.Instant;
import java.util.Arrays;
import java.util.Objects;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Document {

    @Id
    private UUID documentId;
    private String blobPath;
    @Column(name = "iv")
    private byte[] fileIv;
    private Instant revokedAt;

    private Document() {
    }

    public Document(UUID documentId, String blobPath, byte[] fileIv, Instant revokedAt) {
        byte[] iv = Objects.requireNonNull(fileIv, "Document entity - Iv column cannot be null");

        this.documentId = documentId;
        this.blobPath = blobPath;
        this.fileIv = Arrays.copyOf(iv, fileIv.length);
        this.revokedAt = revokedAt;
    }

    public Document(UUID documentId, String blobPath, byte[] fileIv) {
        this(documentId, blobPath, fileIv, null);
    }

    public UUID identity() {
        return documentId;
    }

    public String blobPath() {
        return blobPath;
    }

    public byte[] iv() {
        return Arrays.copyOf(fileIv, fileIv.length);
    }

    public Instant revokedAt() {
        return revokedAt;
    }

    public boolean isRevoked() {
        return Objects.nonNull(revokedAt);
    }
}
