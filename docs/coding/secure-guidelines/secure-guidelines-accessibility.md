
# Secure Coding Guidelines – Section 4: Accessibility and Extensibility

## Guideline 4-1: Limit the accessibility of classes, interfaces, methods, and fields

**Explanation:** Reduce attack surface by making fields and classes private or package-private unless there's a good reason to expose them.

**Java SE Example:**

```java
public final class TokenGenerator { ... }
```

**Spring Boot Example:**

```java
@Service
public final class SensitiveService { ... }
```

## Guideline 4-2: Use modules to hide internal packages

**Explanation:** The Java module system helps prevent exposure of implementation details.

**Java SE Example:**

```java
module com.example.myapp {
    exports com.example.myapp.api;
}
```

**Spring Boot Example:**

```java
@SpringBootApplication
@ComponentScan(basePackages = {"com.example.myapp.api"})
public class MyApp { }
```

(... additional accessibility guidelines would follow ...)
