# eduana-backend

The Eduana Project is an educational management platform designed to support multiple user roles: Parents, Kids, Teachers, Coordinators, and Admins. The platform provides tools for managing lessons, tracking progress, facilitating classroom activities, and supporting interactive learning experiences such as coding lessons.

# Database Documentation

## Schema and Relationships

### Tables:

1. **user**

   - Stores information about users (students, teachers, admins, etc.).
   - Each user has a unique role defined in the `role_type` enum.
   - Relationships:
     - A teacher **teaches** multiple classes.
     - A student **enrolled\_in** multiple classes.

2. **class**

   - Represents a group of students taught by a teacher.
   - Relationships:
     - A teacher **teaches** a class.
     - A class has multiple students **enrolled\_in** it.

3. **lesson**

   - Represents individual lessons scheduled for a class.
   - Relationships:
     - Each lesson belongs to a `class`.
     - Each lesson is assigned to a `teacher`.

4. **attendance**

   - Tracks student attendance for each lesson.
   - Relationships:
     - Links a `lesson` and a `student`.

5. **announcement**

   - Stores class-related announcements.
   - Relationships:
     - Each announcement is associated with a `class`.

## Installation Instructions

### Prerequisites

- PostgreSQL 12+
- psql command-line tool

### Steps to Install

1. Clone the repository:
   ```sh
   git clone github.com/kucukbahadir/eduana-backend
   cd <repository_folder>
   ```
2. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE eduana_front;
   ```
3. Connect to the database:
   ```sh
   psql -d eduana_front
   ```
4. Execute the SQL dump file to create tables:
   ```sh
   psql -d eduana_front -f eduana_front.sql
   ```

### Environment Variables

Ensure that your application has access to the following environment variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eduana_front
DB_USER=your_username
DB_PASSWORD=your_password
```

## Usage

After setting up the database, you can connect to it using any PostgreSQL client&#x20;

## ER Diagram

Refer to `ERD_eduana.png` for a visual representation of the database schema.

# Health Check
The application includes a health check endpoint to verify server status.

### Endpoint
- URL: `http://localhost:3000/api/health`
- Method: GET
- Response: JSON object with server status and timestamp

### Response Format
```json
{
    "status": "healthy",
    "timestamp": "2025-02-06T11:17:35.178Z",
    "server": "running"
}
```

### Testing the Endpoint
Choose one of these methods to test the health check:

#### Using Browser
1. Open your web browser
2. Navigate to `http://localhost:3000/api/health`

#### Using PowerShell
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/health
```

#### Using cURL
```bash
curl http://localhost:3000/api/health
```

### Expected Response
- Status Code: 200 OK
- Content-Type: application/json
- The response indicates the server is running and accepting requests
