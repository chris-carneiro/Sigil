
# Secure Coding Guidelines – Section 6: Mutability

## Guideline 6-1: Make fields private and final wherever possible

**Explanation:** Reduces unintended changes and makes objects inherently thread-safe.

**Java SE Example:**

```java
public final class User {
    private final String username;
    public User(String username) {
        this.username = username;
    }
}
```

**Spring Boot Example:**

```java
public record UserDto(String id, String email) {}
```

## Guideline 6-2: Make defensive copies of mutable inputs and outputs

**Explanation:** Prevent external mutation of internal state.

**Java SE Example:**

```java
public User(List<String> roles) {
    this.roles = new ArrayList<>(roles);
}
```

**Spring Boot Example:**

```java
public List<String> getRoles() {
    return List.copyOf(this.roles);
}
```

(... additional mutability guidelines would follow ...)
