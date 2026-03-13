
# Secure Coding Guidelines – Section 1: Denial of Service

## Guideline 1-1: Limit resource consumption from user input

**Explanation:** Inputs like file uploads, request parameters, or data in loops can exhaust memory, CPU, or disk.

**Java SE Example:**

```java
if (input.length() > 1000) {
    throw new IllegalArgumentException("Input too large");
}
```

**Spring Boot Example:**

```java
@PostMapping("/process")
public ResponseEntity<Void> process(@RequestBody String input) {
    if (input.length() > 1000) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Input too large");
    }
    return ResponseEntity.ok().build();
}
```

## Guideline 1-2: Use bounded data structures

**Explanation:** Unbounded collections like ArrayLists or HashMaps can lead to memory exhaustion if misused.

**Java SE Example:**

```java
BlockingQueue<String> queue = new ArrayBlockingQueue<>(1000);
```

**Spring Boot Example:**

```java
@Bean
public BlockingQueue<String> boundedQueue() {
    return new ArrayBlockingQueue<>(1000);
}
```

(... other DoS guidelines would follow ...)
