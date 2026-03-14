package dev.silentcraft.sigil.api.controller;


import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import dev.silentcraft.sigil.api.error.InvalidDocumentException;
import dev.silentcraft.sigil.api.error.SigilErrorResponse;
import dev.silentcraft.sigil.domain.error.DocumentNotFoundException;

@RestControllerAdvice
public class RestExceptionController {

    public static final String UNREADABLE_DOCUMENT = "Failed to process document.";


    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<SigilErrorResponse> handleMissingPart(
            MissingServletRequestPartException ex) {
        String message = "Required field '%s' is missing."
                .formatted(ex.getRequestPartName());
        return ResponseEntity.badRequest()
                .body(SigilErrorResponse.badRequest(message));
    }

    @ExceptionHandler(InvalidDocumentException.class)
    public ResponseEntity<SigilErrorResponse> handleInvalidDocumentException(InvalidDocumentException ex) {
        return ResponseEntity.badRequest()
                .body(SigilErrorResponse.badRequest(ex.getMessage()));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<SigilErrorResponse> handleIOException(IOException ex) {
        return ResponseEntity.internalServerError()
                .body(SigilErrorResponse.internalServerError(UNREADABLE_DOCUMENT));
    }

    @ExceptionHandler(DocumentNotFoundException.class)
    public ResponseEntity<SigilErrorResponse> handleDocumentNotFoundException(DocumentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(SigilErrorResponse.notFound(
                        DocumentNotFoundException.DOCUMENT_NOT_FOUND)
                );
    }


}
