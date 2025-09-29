## Libraries Used
* Spring Boot Actuator [3.3.3]
* Lombok [1.18.34]
* Spring Data JPA [3.3.3]
* Spring Web [6.1.12]
* PostgreSQL Driver [42.7.3]

## Setup
1. Clone this repository.
2. Configure PostgreSQL
   * Run PostgreSQL
   * Create a new database
   * Update `backend/src/main/resources/application.properties` with:
     * your PostgreSQL connection details (url, username and password)
     * your AI api key (see Adding AI API Key (Gemini))
3. Navigate to the backend directory and build the project with `./gradlew build` or `./gradlew clean build`.
4. Navigate to the frontend directory and install the frontend dependencies with `npm install`.

## Adding AI API Key (Gemini)
1. Generate an API Key from https://aistudio.google.com/
2. Paste API Key into `backend/src/main/resources/application.properties` into the `ai.api.key=` configuration item.

## Running the Application
1. Ensure PostgreSQL is running.
2. In a new terminal, navigate to the backend directory and run the backend application with `./gradlew bootRun`.
3. In another terminal, navigate to the frontend directory and run the frontend application with `npm run dev`.
4. Access the web application via `http://localhost:5173/`.
