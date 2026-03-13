
# Secure Coding Guidelines – Section 2: Confidential Information

## Guideline 2-1: Protect sensitive data in memory

**Explanation:** Sensitive data like passwords or keys should not stay in memory longer than necessary.

**Java SE Example:**

```java
char[] password = readPassword();
try {
    authenticate(password);
} finally {
    Arrays.fill(password, ' ');
}
```

**Spring Boot Example:**

```java
@PostMapping("/login")
public ResponseEntity<Void> login(@RequestBody LoginDto dto) {
    authService.authenticate(dto.getUsername(), dto.getPassword());
    return ResponseEntity.ok().build();
}
```

## Guideline 2-2: Avoid logging sensitive information

**Explanation:** Never log secrets, tokens, or personal data.

**Java SE Example:**

```java
logger.info("User login attempt: {}", user.getUsername()); // Avoid passwords or tokens
```

**Spring Boot Example:**

```java
log.info("Processing request for user {}", userDto.getUsername());
```

(... additional confidential guidelines would follow ...)
