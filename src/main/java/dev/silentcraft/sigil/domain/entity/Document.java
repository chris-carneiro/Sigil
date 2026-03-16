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
    private String fileName;
    private String blobPath;
    private Long fileSize;
    @Column(name = "iv")
    private byte[] fileIv;
    private Instant revokedAt;

    private Document() {
    }

    public Document(UUID documentId, String fileName, String blobPath, Long fileSize, byte[] fileIv, Instant revokedAt) {
        byte[] iv = Objects.requireNonNull(fileIv, "Document entity - Iv column cannot be null");

        this.documentId = documentId;
        this.fileName = fileName;
        this.blobPath = blobPath;
        this.fileSize = fileSize;
        this.fileIv = Arrays.copyOf(iv, fileIv.length);
        this.revokedAt = revokedAt;
    }

    public Document(UUID documentId, String fileName, String blobPath, Long fileSize, byte[] fileIv) {
        this(documentId, fileName, blobPath, fileSize, fileIv, null);
    }

    public UUID identity() {
        return documentId;
    }

    public String fileName() {
        return fileName;
    }

    public String blobPath() {
        return blobPath;
    }

    public Long fileSize() {
        return fileSize;
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
