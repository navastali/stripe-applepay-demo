# --- Stage 1: Build jar ---
FROM maven:3.8.6-eclipse-temurin-8 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src

RUN mvn -e -X -B -DskipTests clean package

# --- Stage 2: Run jar ---
FROM eclipse-temurin:8-jdk

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
