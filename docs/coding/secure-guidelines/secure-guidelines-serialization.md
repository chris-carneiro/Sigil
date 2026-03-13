
# Secure Coding Guidelines – Section 8: Serialization and Deserialization

## Guideline 8-1: Do not deserialize untrusted data

**Explanation:** Deserializing untrusted data can lead to remote code execution.

**Java SE Example:**

```java
ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());
Object obj = ois.readObject(); // ❌ dangerous with untrusted sources
```

**Spring Boot Example:**

```java
@PostMapping("/deserialize")
public Object insecureDeserialize(@RequestBody byte[] payload) throws Exception {
    try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(payload))) {
        return in.readObject(); // ❌ avoid
    }
}
```

## Guideline 8-2: Validate and sanitize deserialized data

**Explanation:** Even trusted sources may contain unexpected or malicious data.

**Java SE Example:**

```java
UserProfile profile = (UserProfile) ois.readObject();
if (!isValidEmail(profile.email())) {
    throw new IllegalArgumentException("Invalid email");
}
```

**Spring Boot Example:**

```java
@PostMapping("/register")
public ResponseEntity<Void> register(@Valid @RequestBody UserDto dto) {
    return ResponseEntity.ok().build();
}
```

(... additional serialization guidelines would follow ...)
