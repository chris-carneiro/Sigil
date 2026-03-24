FROM maven:3.9.14-eclipse-temurin-17 AS  build-stage

WORKDIR /opt/sigil

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

COPY ./src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre AS final-stage

WORKDIR /opt/sigil

RUN adduser --disabled-password sigil
RUN mkdir -p /data/sigil/documents && chown -R sigil:sigil /data/sigil/documents
ENV SIGIL_STORAGE_PATH=/data/sigil/documents
USER sigil

COPY --from=build-stage --chown=sigil:sigil /opt/sigil/target/*.jar /opt/sigil/sigil-0.0.1-app.jar
EXPOSE 8080
CMD ["java", "-jar", "sigil-0.0.1-app.jar"]