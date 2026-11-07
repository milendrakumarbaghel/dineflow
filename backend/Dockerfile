# Backend Dockerfile for DineFlow Spring Boot Application
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /build

# Copy Maven wrapper and pom.xml
COPY mvnw pom.xml ./
COPY .mvn/ .mvn/

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code and build application
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S dineflow && adduser -S dineflow -G dineflow

COPY --from=builder /build/target/dineflow-backend-*.jar app.jar

USER dineflow

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=postgres

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
