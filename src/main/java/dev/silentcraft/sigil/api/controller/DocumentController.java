package dev.silentcraft.sigil.api.controller;

import java.io.IOException;
import java.net.URI;
import java.util.Base64;
import java.util.UUID;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import dev.silentcraft.sigil.api.dto.DocumentResponse;
import dev.silentcraft.sigil.api.error.InvalidDocumentException;
import dev.silentcraft.sigil.domain.service.DocumentService;
import dev.silentcraft.sigil.domain.valueobject.DocumentIdentity;
import dev.silentcraft.sigil.domain.valueobject.EncryptedDocument;
import dev.silentcraft.sigil.domain.valueobject.StoredDocument;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping
    public ResponseEntity<DocumentResponse> uploadDocument(@RequestParam("document") MultipartFile document,
                                                           @RequestParam("iv") MultipartFile fileIv) throws IOException {
        if (document.isEmpty()) {
            throw new InvalidDocumentException(InvalidDocumentException.EMPTY_DOCUMENT);
        }

        DocumentIdentity documentIdentity = documentService.store(new EncryptedDocument(document.getOriginalFilename(), document.getContentType(), document.getBytes(), fileIv.getBytes()));

        UUID documentId = documentIdentity.id();
        URI location = URI.create("/api/v1/documents/" + documentId);

        return ResponseEntity.created(location).body(new DocumentResponse(documentId));
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable UUID documentId) {
        StoredDocument storedDocument = documentService.find(documentId);
//        TODO ContentDisposition.builder("attachment").filename(storedDocument.fileName(), Charset.forName(storedDocument.mimeType()));
        ContentDisposition attachment = ContentDisposition.builder("attachment").filename(storedDocument.fileName()).build();
        return ResponseEntity.ok()
                .header("encryption-metadata-iv", Base64.getEncoder().encodeToString(storedDocument.iv()))
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE)
                .header(HttpHeaders.CONTENT_DISPOSITION, attachment.toString())
                .body(storedDocument.encryptedBlob());
    }
}
