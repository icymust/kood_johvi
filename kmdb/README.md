# Movies API
This application is built using Spring Boot and JPA, allowing users to store and manage movies, genres, and actors. It supports CRUD operations, filtering, pagination, and more.
## **Project Overview**

This API is designed for a film society to manage their growing movie database. It allows users to:

- Add, update, and delete movies, genres, and actors.
- Associate movies with genres and actors.
- Retrieve filtered lists of movies by genre, release year, or actor.
- Implement pagination for large datasets.

## 1. Features
The API supports the following entities:
- Genre
- Actor
- Movie

Each entity has dedicated endpoints for creating, retrieving, updating, and deleting records, along with specific endpoints for advanced filtering.

- **CRUD Operations**: Full support for create, read, update, and delete operations.
- **Filtering and Searching**: Retrieve movies by genre, release year, or actor. Search for movies by title and actors by name.
- **Relationships**: Many-to-many associations between movies, genres, and actors.
- **Pagination**: Paginated responses for large datasets.
- **Error Handling**: Custom exception handling and input validation.
## 2. Technologies Used
- Spring Boot (Java)
- Spring Data JPA
- SQLite
- Hibernate Validator
## 3. Setup and Installation
### Prerequisites:
- Java 17 or later
- Maven
- SQLite installed (optional, SQLite database will be created automatically)
### Installation
1. Clone the repository:
   ```bash
   git clone https://gitea.kood.tech/martinmustonen/kmdb

   cd kmdb
   ```
2. Build the application:
   ```bash
   mvn clean install
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. Access the application at:
    - API base URL: `http://localhost:8080`
    - Example endpoint: `http://localhost:8080/api/genres`

### Validation Rules
- Movie title must be between 1 and 254 characters.
- Actor name cannot be blank.
- Genre names must be unique.
- Date fields must be in ISO 8601 format (e.g., `YYYY-MM-DD`).

## **API Endpoints**

### **Genre Endpoints**
- `POST /api/genres` - Create a new genre.
- `GET /api/genres` - Retrieve all genres.
- `GET /api/genres/{id}` - Retrieve a genre by ID.
- `PATCH /api/genres/{id}` - Update a genre.
- `DELETE /api/genres/{id}` - Delete a genre (with optional force delete).

### **Movie Endpoints**
- `POST /api/movies` - Create a new movie.
- `GET /api/movies` - Retrieve all movies with pagination.
- `GET /api/movies/{id}` - Retrieve a movie by ID.
- `GET /api/movies?genre={genreId}` - Retrieve movies filtered by genre.
- `GET /api/movies?year={releaseYear}` - Retrieve movies filtered by release year.
- `GET /api/movies/search?title={title}` - Search movies by title.
- `GET /api/movies/{movieId}/actors` - Retrieve all actors in a movie.
- `PATCH /api/movies/{id}` - Update a movie.
- `DELETE /api/movies/{id}` - Delete a movie (with optional force delete).

### **Actor Endpoints**
- `POST /api/actors` - Create a new actor.
- `GET /api/actors` - Retrieve all actors with pagination.
- `GET /api/actors/{id}` - Retrieve an actor by ID.
- `GET /api/actors?name={name}` - Search actors by name.
- `GET /api/actors/{actorId}/movies` - Retrieve all movies an actor has appeared in.
- `PATCH /api/actors/{id}` - Update an actor.
- `DELETE /api/actors/{id}` - Delete an actor (with optional force delete).


## 5. Database Structure (movie_db.db)

```
├── Movies
│  - id (Primary Key)
│  - title
│  - releaseYear
│  - duration
├── Actors
│  - id (Primary Key)
│  - name
│  - birthDate
├── Genres
│  - id (Primary Key)
│  - name
├── Movie_Actor (Many-to-many relationship table between Movies and Actors)
├── Movie_Genre (Many-to-many relationship table between Movies and Genres)
```
## 6.Project Structure

```
movies-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.example.moviesapi/
│   │   │       ├── controllers/         # REST API controllers (GenreController, MovieController, ActorController)
│   │   │       ├── DTO/                 # Data Transfer Objects (GenreDTO, MovieDTO, ActorDTO)
│   │   │       ├── entity/              # JPA entities (Genre, Movie, Actor)
│   │   │       ├── util/                # Exceptions and handlers
│   │   │       ├── repositories/        # Spring Data JPA repositories
│   │   │       └── services/            # Business logic (GenreService, MovieService, ActorService)
│   │   │       └── KmdbApplication.java # Main programm to start
│   │   │       └── LocalDateStringConverter.java # Converter for special dates
│   │   └── resources/
│   │       ├── application.properties  # Configuration file for database and server settings
│   │       └── data.sql                # Sample data for database initialization
│   └── test/
│       └── java/                       # Unit and integration tests
├── pom.xml                             # Maven configuration file
└── README.md                           # Project documentation
```

## 7. Pagination
Default page size of 10.

Example - `/genres?page={page number}&size={size}`  

