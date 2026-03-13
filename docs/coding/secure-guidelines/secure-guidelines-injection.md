
# Secure Coding Guidelines – Section 3: Injection and Inclusion

## Guideline 3-1: Generate valid formatting

**Explanation:** Use safe libraries for XML, HTML, etc. Never concatenate untrusted data directly.

**Java SE Example:**

```java
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
Document doc = dbf.newDocumentBuilder().newDocument();
```

**Spring Boot Example:**

```html
<p th:text="${userInput}"></p> <!-- auto-escaped in Thymeleaf -->
```

(... additional injection guidelines would follow ...)
