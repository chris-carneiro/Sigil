package dev.silentcraft.sigil.api.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import dev.silentcraft.sigil.domain.error.DocumentReadException;
import dev.silentcraft.sigil.api.error.InvalidDocumentException;
import dev.silentcraft.sigil.api.error.SigilErrorResponse;

@RestControllerAdvice
public class RestExceptionController {

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

    @ExceptionHandler(DocumentReadException.class)
    public ResponseEntity<SigilErrorResponse> handleUnreadableDocumentContent(DocumentReadException ex) {
        return ResponseEntity.internalServerError()
                .body(SigilErrorResponse.internalServerError(DocumentReadException.UNREADABLE_DOCUMENT));
    }


}
