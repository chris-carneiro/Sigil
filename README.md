# Sigil — Share Privately

[![Java CI with Maven](https://github.com/chris-carneiro/Sigil/actions/workflows/tests.yml/badge.svg)](https://github.com/chris-carneiro/Sigil/actions/workflows/tests.yml)
![Coverage](.github/badges/jacoco.svg)

Secure document sharing via expiring QR codes. Documents are encrypted
in the browser before upload. The server stores only encrypted bytes
it cannot read.

**Security model:** The encryption key lives exclusively in the URL fragment (`#`), which
browsers never send to the server. The IV is stored server-side only. An intercepted QR
code alone cannot decrypt a document without the server-held IV.

## Prerequisites

- Docker
- Java 17+
- Maven
- Node.js 18+
- Redis 7

## Quick Start

**1. Environment Variables.**

### Production Mode:

Create the `.env` file at the root of the project and fill with appropriate values.

| Variable           | Description               |
|--------------------|---------------------------|
| POSTGRES_DB        | PostgreSQL Database name  |
| POSTGRES_USER      | Database username         |
| POSTGRES_PASSWORD  | Database password         |
| SIGIL_STORAGE_PATH | Document storage location |
| REDIS_PASSWORD     | Redis password            |
| LOG_LEVEL_APP      | App log level             |
| LOG_LEVEL_TOMCAT   | Tomcat log level          |
| LOG_LEVEL_SPRING   | Spring log level          |

These variables are read by Docker Compose and injected as environment variables into both the postgres and app
containers when the full stack is run.

### Dev mode: Defaults should be provided in application-local.yaml for local development.

**`application-local.yaml` is gitignored. Create it locally inside `src/main/resources/`.**

```bash
In dev mode documents are stored inside `${user.home}/.sigil/private/documents` by default.
```

**2. Start the app + DB & Redis**

```bash
docker-compose up -d
```

**3. Add the `application-local.yaml` in your `src/main/resources/` folder.**

Add fallback values by replacing the `<default>` tags with custom values. Make sure these values match your local
postgres database name, credentials, and Redis password.

```yaml
spring:
  application:
    name: Sigil
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/<default>}
    username: ${SPRING_DATASOURCE_USERNAME:<default>}
    password: ${SPRING_DATASOURCE_PASSWORD:<default>}
  data:
    redis:
      host: localhost
      port: 6379
      password: ${SPRING_DATA_REDIS_PASSWORD:<default>}
```

**4. Run the application.**

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

Or from IntelliJ with `-Dspring.profiles.active=local` in the run configuration.

**5. Get a pulse from Sigil.**

```shell
curl localhost:8080/actuator/health
```

**It should return:**

```json
{"status":"UP"}
```

## Frontend

The frontend is a React 19 app built with Vite.

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173` by default.
