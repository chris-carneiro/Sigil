# Sigil — Share Privately

Secure document sharing via expiring QR codes. Documents are encrypted
in the browser before upload. The server stores only encrypted bytes
it cannot read.

## Prerequisites

- Docker
- Java 17+
- Maven

## Quick Start

**1.Environment Variables.**

### Production Mode:

Create the .env file at the root of the project and fill with appropriate values**

| Variable           | Description               |
|--------------------|---------------------------|
| POSTGRES_DB        | PostgreSQL Database name  |
| POSTGRES_USER      | Database username         |
| POSTGRES_PASSWORD  | Database password         |
| SIGIL_STORAGE_PATH | Document storage location |

These variables are read by Docker Compose and injected as environment variables into both the postgres and app
containers when the full stack is run.

### Dev mode: Defaults should be provided in application-local.yaml for local development.

**`application-local.yml` is gitignored. Create it locally inside src/main/resources/.**

```bash
  In dev mode documents are stored inside `${user.home}/.sigil/private/documents` by default.
```

**2. Start the database**

```bash
  docker-compose up -d postgres
```

**3. Add the application-local.yaml in your main/resources folder.**

Add fallback values by replacing the <default> tags with custom values. Make sure these values match your local postgres
database name and credentials.

```yaml
spring:
  application:
    name: Sigil
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/<default>}
    username: ${SPRING_DATASOURCE_USERNAME:<default>}
    password: ${SPRING_DATASOURCE_PASSWORD:<default>}
```

**4. Run the application.**

```bash
  ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Or from IntelliJ with `-Dspring.profiles.active=local`
in the run configuration.

**5. Get a pulse from Sigil.**

```shell
  curl localhost:8080/actuator/health
``` 

**It should return:**

``` json
 {"status":"UP"}
```
