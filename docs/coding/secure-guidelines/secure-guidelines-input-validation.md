
# Secure Coding Guidelines – Section 5: Input Validation

## Guideline 5-1: Validate inputs

**Explanation:** Treat all untrusted data as potentially malicious. Validate before using it.

**Java SE Example:**

```java
if (!email.matches("[^@]+@[^.]+\..+")) {
    throw new IllegalArgumentException("Invalid email");
}
```

**Spring Boot Example:**

```java
public record UserDto(@NotNull @Email String email) {}
```

## Guideline 5-2: Validate output from untrusted objects as input

**Explanation:** Validate data returned by plugins or callbacks, just as you validate user input.

**Java SE Example:**

```java
String pluginResult = plugin.process();
if (!pluginResult.matches("[a-zA-Z]+")) {
    throw new SecurityException("Invalid plugin output");
}
```

(... additional input validation guidelines would follow ...)
