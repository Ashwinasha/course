# Dockerfile (for backend)
FROM openjdk:17-jdk-slim
WORKDIR /app

# Build JAR (if not already built, we assume mvn package before docker build)
COPY target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
