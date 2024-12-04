# Learnify Project

Learnify is an online learning platform that allows users to explore courses, enroll in them, and track their progress. The platform provides tools for both students and teachers, including course management, enrollment, reviews, and payments. Teachers can upload course content such as lessons (videos, audios, text), while students can interact with the content, provide feedback, and enroll in courses.

## Features

- **User Roles**: Students, Teachers, and Admins
- **Course Management**: Create, edit, and categorize courses.
- **Enrollment**: Students can enroll in courses and track their progress.
- **Reviews**: Students can leave ratings and reviews for courses.
- **Payments**: Integrated Stripe payment gateway for course purchases.
- **Content Upload**: Google Drive integration for uploading images, videos, and other course content.
- **Authentication**: Cookie-based session authentication for secure user login.
- **API Documentation**: Swagger API documentation available at `/api` route.
- **Dockerized**: The app is containerized using Docker for easy deployment.

## Project Setup

### Prerequisites

- Node.js (v16 or above)
- Docker
- Remote PostgreSQL database
- Stripe API key for payment processing
- Google Drive API credentials for file uploads

### Installation with Docker 

If you have already added the `.env` file to the container, follow these steps to run the application without needing to manually configure the environment variables.

1. **Pull the Docker Image** from Docker Hub:
   ```bash
   docker pull hazemhamdy/learnify:latest
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -d -p 3000:3000 hazemhamdy/learnify:latest
   ```

   The necessary environment variables are already included in the container, so you don't need to manually configure them.

3. **Access the Application**:  
   Once the container is running, you can access the application at [http://localhost:3000](http://localhost:3000) or the appropriate URL depending on your server configuration.

4. **Access API Documentation**:  
   API documentation is available at [http://localhost:3000/api](http://localhost:3000/api).


### Database Schema

The application uses a PostgreSQL database and Prisma ORM to handle data models. The key models include:

- `User`: Represents users of the platform (students, teachers, admins).
- `Course`: Represents courses offered by the platform.
- `Category`: Represents course categories.
- `Enrollment`: Tracks student enrollments in courses.
- `Review`: Stores student reviews and ratings for courses.
- `Payment`: Tracks payments made for course enrollments.
- `Section`: Represents different sections within a course.
- `Lesson`: Represents individual lessons within a section.
- `Comment`: Stores comments made by users on lessons.

### Authentication

Learnify uses cookie-based session authentication. The session is stored in a cookie and used to manage user login and access control.

### Stripe Integration

Stripe is used for handling payments. Users can securely make payments for course enrollments, and the payment status is tracked.

### Google Drive Integration

Course content (images, videos, and other files) is uploaded to Google Drive. The content can then be accessed through the platform.

### API Documentation

The project provides an API for programmatic access to the platform’s data. API documentation is available at:

- `/api`: Contains all available API routes and usage information.

### Docker

The project can be run using Docker. The `Dockerfile` and `docker-compose.yml` files are configured for easy containerization. Run the following command to set up and run the app inside a Docker container:

```bash
docker-compose up --build
```

### Testing

You can run unit and integration tests using:

```bash
npm run test
```

### Deployment

To deploy the application, make sure the environment variables are properly set on your hosting server, and use Docker for containerized deployment. Alternatively, you can deploy the app manually without Docker by setting up a Node.js environment and PostgreSQL database.

### Contributing

If you would like to contribute to the project, feel free to fork the repository, make changes, and create a pull request.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
