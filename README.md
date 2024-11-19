# Learnify 🎓  

Learnify is an educational platform inspired by Udemy. Built with **NestJS**, **Prisma**, and **PostgreSQL**, it allows teachers to create engaging courses and students to enroll, learn, and interact through features like categorized courses, questions, and reviews.  

---

## Features 🚀  

### For Teachers:  
- **Create & Manage Courses**: Teachers can add sections and lessons to their courses.  
- **Secure Video Hosting**: Lesson videos are uploaded to **Google Drive**, accessible only to enrolled users.  

### For Students:  
- **Enroll in Courses**: Students can join courses and make secure payments using **Stripe**.  
- **Interactive Learning**:  
  - Ask questions in lessons.  
  - Review and rate courses.  

### General Features:  
- **Course Categories**: Browse and filter courses by category.  
- **User Authentication**: Cookie-based sessions for secure access.  
- **Manage User Profile**: View and edit user details and enrolled courses.  

---

## Tech Stack 💻  

### Backend:  
- **[NestJS](https://nestjs.com/)**: Scalable framework for server-side applications.  
- **[Prisma](https://www.prisma.io/)**: Database ORM for managing **PostgreSQL**.  
- **[PostgreSQL](https://www.postgresql.org/)**: Relational database for data persistence.  

### Additional Services:  
- **[Stripe](https://stripe.com/)**: Payment processing.  
- **[Google Drive API](https://developers.google.com/drive)**: File storage and access control.  
- **[Multer](https://github.com/expressjs/multer)**: File handling for uploads.  

---

## API Endpoints 📡  

### Auth  
- `POST /auth/signup` - Register a new user.  
- `POST /auth/login` - Log in a user.  
- `POST /auth/signout` - Log out a user.  
- `PATCH /auth/update-password` - Update password.  

### Categories  
- `POST /categories` - Create a category.  
- `GET /categories` - List all categories.  
- `GET /categories/:id` - Get category details.  
- `PATCH /categories/:id` - Update category.  
- `DELETE /categories/:id` - Delete category.  

### Comments  
- `POST /comments` - Add a comment.  
- `GET /comments/:id` - Get comments for a lesson.  
- `PATCH /comments/:id` - Update a comment.  
- `DELETE /comments/:id` - Delete a comment.  

### Courses  
- `POST /courses` - Create a course.  
- `GET /courses` - List all courses.  
- `GET /courses/filtered` - Filter courses by category.  
- `GET /courses/:id` - Get course details.  
- `PATCH /courses/:id` - Update a course.  
- `DELETE /courses/:id/admin` - Admin-only course deletion.  
- `DELETE /courses/:id` - Delete owned course.  

### Enrollments  
- `POST /enrollments` - Enroll in a course.  
- `GET /enrollments/:id` - Get enrollment details.  
- `PATCH /enrollments/:id` - Update enrollment.  
- `DELETE /enrollments/:id` - Cancel enrollment.  

### Lessons  
- `POST /lessons` - Add a lesson to a section.  
- `GET /lessons/:id` - Get lesson details.  
- `PATCH /lessons/:id` - Update lesson.  
- `DELETE /lessons/:id` - Delete lesson.  
- `GET /lessons/:id/comments` - Get lesson comments.  

### Reviews  
- `POST /reviews` - Add a review.  
- `GET /reviews/:id` - Get reviews for a course.  
- `PATCH /reviews/:id` - Update a review.  
- `DELETE /reviews/:id` - Delete a review.  

### Sections  
- `POST /sections` - Add a section to a course.  
- `GET /sections/:id` - Get section details.  
- `PATCH /sections/:id` - Update section.  
- `DELETE /sections/:id` - Delete section.  

### Upload File  
- `POST /upload-file` - Upload lesson files.  

### Users  
- `GET /users/:id/teacher` - Get teacher details.  
- `PATCH /users/me` - Update user profile.  
- `GET /users/me` - Get current user details.  
- `GET /users/me/my-learning` - Get courses the user is enrolled in.  

---

## Roadmap 🗺️  

1. **Dockerize the Application**: Simplify deployment with containerization.  
2. **Swagger Integration**: Add API documentation for better development experience.  
3. **Real-Time Notifications**: Notify users about new questions and reviews.  
4. **Frontend Development**: Build an intuitive front-end for seamless interaction.  
5. **Enhanced Video Streaming**: Improve the performance and scalability of video delivery.  

---

## Contributing 🤝  

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request.  

---

## License 📜  

This project is licensed under the MIT License.  

--- 
