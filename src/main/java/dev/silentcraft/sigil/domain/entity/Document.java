package dev.silentcraft.sigil.domain.entity;

import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Document {

    @Id
    private UUID documentId;
    private String fileName;
    private String blobPath;
    private Long fileSize;

    private Document() {
    }

    public Document(UUID documentId, String fileName, String blobPath, Long fileSize) {
        this.documentId = documentId;
        this.fileName = fileName;
        this.blobPath = blobPath;
        this.fileSize = fileSize;
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
}
