# Spring Boot Backend Application

This project is a Spring Boot application with PostgreSQL as the database.

## Prerequisites
Ensure you have the following installed:
* Java JDK 17
* Gradle
* PostgreSQL

## Setup
1. Clone this repository
2. Configure PostgreSQL
    * Run PostgreSQL
    * Create a new database
    * Update `src/main/resources/application.properties` with your PostgreSQL connection details (url, username and password)
3. Navigate to the backend directory
4. Build the project with `./gradlew build` or `./gradlew clean build`.

Note: if it does not build successfully, try manually deleting all tables from the database and try again.
## Adding AI API Key (Gemini)
1. Generate an API Key from https://aistudio.google.com/
2. Paste API Key into `src/main/resources/application.properties` into the `ai.api.key=` configuration item.

## Running the Application
1. Ensure PostgreSQL is running
2. Navigate to the backend directory
3. Run the application `./gradlew bootRun`
4. (Optional) Access the application via `http://localhost:8080`

## Testing
* Run tests using `./gradlew test`
