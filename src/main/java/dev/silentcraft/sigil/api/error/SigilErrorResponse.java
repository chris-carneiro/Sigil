package dev.silentcraft.sigil.api.error;

import org.springframework.http.HttpStatus;

public record SigilErrorResponse(int status, String message) {

    public static SigilErrorResponse badRequest(String message) {
        return new SigilErrorResponse(HttpStatus.BAD_REQUEST.value(), message);
    }

    public static SigilErrorResponse internalServerError(String message) {
        return new SigilErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), message);
    }

    public static SigilErrorResponse notFound(String message) {
        return new SigilErrorResponse(HttpStatus.NOT_FOUND.value(), message);
    }
}

