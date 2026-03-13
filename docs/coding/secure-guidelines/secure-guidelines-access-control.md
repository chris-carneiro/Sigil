
# Secure Coding Guidelines – Section 9: Access Control

## Guideline 9-1: Perform security checks at a single point

**Explanation:** Avoid spreading permission checks throughout your codebase.

**Java SE Example:**

```java
if (!user.hasPermission("RESOURCE_ACCESS")) throw new AccessDeniedException();
SecureResource res = new SecureResource();
```

**Spring Boot Example:**

```java
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin/data")
public String getAdminData() { ... }
```

## Guideline 9-2: Associate permissions with objects, not classes

**Explanation:** Permissions should depend on individual instances, not just their class.

**Java SE Example:**

```java
if (user.canRead(doc)) { doc.read(); }
```

**Spring Boot Example:**

```java
@PreAuthorize("@accessChecker.canAccessDocument(authentication, #doc)")
public void edit(Document doc) { ... }
```

(... additional access control guidelines would follow ...)
