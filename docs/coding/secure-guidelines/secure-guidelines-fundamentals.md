
# Secure Coding Guidelines – Section 0: Fundamentals

## Guideline FUNDAMENTALS-0: Prefer clear, obviously safe code

**Explanation:** Avoid requiring clever logic to see why code is secure.

**Java SE Example:**

```java
if (user == null) {
    throw new IllegalArgumentException("User cannot be null");
}
process(user);
```

**Spring Boot Example:**

```java
@RestController
public class UserController {
    @PostMapping("/users")
    public ResponseEntity<Void> create(@RequestBody @Valid UserDto user) {
        userService.create(user);
        return ResponseEntity.ok().build();
    }
}
```

## Guideline FUNDAMENTALS-1: Design APIs to avoid security concerns

**Explanation:** APIs should naturally lead developers toward secure usage.

**Java SE Example:**

```java
public final class SecureConfig {
    private final String config;
    public SecureConfig(String config) {
        this.config = config;
    }
}
```

**Spring Boot Example:**

```java
@Service
public final class SecureService {
    public String process(String input) {
        return sanitize(input);
    }
}
```

(... additional fundamentals guidelines would follow ...)
