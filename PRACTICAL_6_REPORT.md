# PRACTICAL NO. 6

## Back-End Web Development & Cloud Deployment: RESTful API with Database

**Project Title:** Student Records RESTful API Management System  
**Submitted by:** Krish Jagannath Adate  
**Course:** B.Tech in Software Engineering  
**College:** MIT Academy of Engineering, Alandi, Pune  
**Subject:** Web Technology  
**Academic Year:** 2026-27  
**PRN:** 202401100031  

---

## 1. Aim

To develop a RESTful API using Node.js and Express connected to a database, implement complete Create, Read, Update, and Delete (CRUD) operations, deploy the application to a cloud web hosting platform, and verify all API endpoints using Postman.

---

## 2. Objectives

- To design and build a RESTful API using Node.js and Express.js adhering to standard HTTP methods.
- To connect the application to a MongoDB database using Mongoose ODM with schema validation constraints.
- To implement all four CRUD operations:
  - Creating new student records (`POST`).
  - Retrieving all or individual student records (`GET`).
  - Updating existing student records (`PUT`).
  - Deleting student records (`DELETE`).
- To test and verify every endpoint locally and in production using Postman.
- To deploy the API onto a cloud web hosting provider (Render) and make it accessible via a public URL.

---

## 3. Problem Statement

Academic institutions and modern web systems require reliable, scalable back-end services to manage student information without data corruption or unauthorized duplication. Direct database access from client interfaces is insecure and unmaintainable. 

The **Student Records RESTful API Management System** provides a centralized, secure REST API layer that validates incoming data, enforces uniqueness on student roll numbers and emails, executes database CRUD operations, provides meaningful HTTP status codes, and is deployed to the cloud for global accessibility.

---

## 4. Technologies Used

- **Node.js**: Asynchronous, event-driven JavaScript runtime environment for executing back-end code.
- **Express.js**: Fast, minimalist web framework used to configure routing, middleware, and request/response handling.
- **MongoDB & Mongoose**: Document-based NoSQL database and Object Data Modeling (ODM) library providing schema structure, field validation, and query execution.
- **Postman**: Comprehensive API platform used to design, automate, and execute HTTP test suites for all endpoints.
- **Git and GitHub**: Version control system and cloud platform to track, manage, and host the project repository.
- **Render**: Cloud web hosting platform used to deploy the containerized web service with environment variables.
- **VS Code**: Integrated Development Environment used for coding, debugging, and terminal execution.

---

## 5. System Implementation

### 5.1 RESTful API Architecture & Endpoints

The API follows standard REST principles, using stateless HTTP communication and returning structured JSON responses across all endpoints.

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health and database connection status | `200 OK` |
| `POST` | `/api/students` | Creates a new student record in database | `201 Created` |
| `GET` | `/api/students` | Retrieves all student records | `200 OK` |
| `GET` | `/api/students/:id` | Retrieves a single student by ID or Roll Number | `200 OK` / `404 Not Found` |
| `PUT` | `/api/students/:id` | Updates an existing student record | `200 OK` / `404 Not Found` |
| `DELETE` | `/api/students/:id` | Removes a student record from the database | `200 OK` / `404 Not Found` |

---

### 5.2 Database Model & Schema Validation

The student entity is modeled using a Mongoose schema (`models/Student.js`) that enforces data integrity:
- **`name`**: Required string, trimmed.
- **`rollNo`**: Required uppercase string, unique academic identifier.
- **`email`**: Required lowercase string, validated against standard email regex, unique.
- **`course`**: Department/major name with default value.
- **`gpa`**: Floating point number strictly bounded between `0.0` and `10.0`.
- **`timestamps`**: Automatically tracks `createdAt` and `updatedAt`.

```javascript
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, required: true, unique: true, uppercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    course: { type: String, required: true, default: 'Computer Science & Engineering' },
    gpa: { type: Number, required: true, min: 0.0, max: 10.0 }
  },
  { timestamps: true }
);
```

---

### 5.3 Controller Logic & CRUD Operations

The controller (`controllers/studentController.js`) processes request parameters and payloads, interacts with MongoDB, handles duplicate record errors (`409 Conflict`), and returns structured responses:

- **Create Record (`createStudent`)**: Checks for missing fields, verifies roll number and email uniqueness, and inserts a new document returning `201 Created`.
- **Read Records (`getAllStudents`, `getStudentById`)**: Queries documents with optional filtering and projection; retrieves by MongoDB ObjectId or Roll Number.
- **Update Record (`updateStudent`)**: Finds the document by ID or Roll Number, applies modifications with validator checks, and returns the updated document.
- **Delete Record (`deleteStudent`)**: Removes the specified record and returns confirmation payload.

---

### 5.4 Application Structure & Code Organization

The application is structured modularly following the Model-View-Controller (MVC) architectural pattern:

```
Practical_6/
├── config/
│   └── db.js                 # Database connection logic
├── controllers/
│   └── studentController.js  # CRUD business logic and request handlers
├── models/
│   └── Student.js            # Mongoose Schema definition
├── routes/
│   └── studentRoutes.js      # RESTful endpoint routes
├── public/
│   └── index.html            # Web dashboard and live documentation
├── server.js                 # Application entry point and middleware configuration
├── test_api.js               # Automated local test suite
└── package.json              # Project dependencies and run scripts
```

*[INSERT SCREENSHOT 1: VS Code showing project files and server.js execution in integrated terminal]*  
*Figure 1: Project structure and server startup in Visual Studio Code.*

---

## 6. Testing and Results

All API endpoints were tested systematically using Postman and the automated test runner.

### 6.1 Test Cases Table

| Test Case | HTTP Method & URL | Input / Action | Expected Result | Result |
| :--- | :--- | :--- | :--- | :--- |
| **Health Check** | `GET /api/health` | Send request to check server status | Status `200 OK`, database status returned | **Pass** |
| **Create Student** | `POST /api/students` | Send valid student JSON payload (`Jane Doe`, `CS202601`, `GPA: 9.2`) | Status `201 Created`, record returned with unique ID | **Pass** |
| **Duplicate Roll No** | `POST /api/students` | Submit duplicate roll number `CS202601` | Status `409 Conflict`, error message returned | **Pass** |
| **Read All Records** | `GET /api/students` | Retrieve all student records | Status `200 OK`, JSON array with count $\ge 1$ | **Pass** |
| **Read By ID** | `GET /api/students/:id` | Fetch specific student using returned ID | Status `200 OK`, student object matching ID returned | **Pass** |
| **Read By Roll No** | `GET /api/students/CS202601`| Fetch student directly by Roll Number | Status `200 OK`, student object returned | **Pass** |
| **Update Record** | `PUT /api/students/:id` | Send updated fields (`GPA: 9.75`, new course name) | Status `200 OK`, updated student object returned | **Pass** |
| **Delete Record** | `DELETE /api/students/:id`| Send delete request for specific student ID | Status `200 OK`, deletion confirmation returned | **Pass** |
| **Verify Deletion** | `GET /api/students/:id` | Fetch deleted student ID | Status `404 Not Found`, error message returned | **Pass** |

**Result Summary:** The application was thoroughly tested locally and on the deployed cloud URL using Postman. All CRUD operations and validation checks executed as expected with appropriate HTTP status codes.

---

### 6.2 Postman Test Screenshots

*[INSERT SCREENSHOT 2: Postman showing POST /api/students with Request body and Status 201 Created]*  
*Figure 2: Creating a new student record in Postman (POST).*

---

*[INSERT SCREENSHOT 3: Postman showing GET /api/students retrieving all records with Status 200 OK]*  
*Figure 3: Retrieving all student records from database (GET).*

---

*[INSERT SCREENSHOT 4: Postman showing PUT /api/students/:id updating GPA with Status 200 OK]*  
*Figure 4: Updating student record in Postman (PUT).*

---

*[INSERT SCREENSHOT 5: Postman showing DELETE /api/students/:id and subsequent 404 confirmation]*  
*Figure 5: Deleting student record and verifying 404 Not Found in Postman.*

---

## 7. GitHub Repository

The complete source code is maintained and version-controlled in a public GitHub repository.

**Repository URL:** `https://github.com/krishneess/Web_tech_pr6` *(Update with your repository URL)*

*[INSERT SCREENSHOT 6: GitHub repository page showing project commits and file structure]*  
*Figure 6: Project source code hosted on GitHub.*

---

## 8. Deployment

The RESTful API was deployed to the **Render** cloud hosting platform and is accessible globally via HTTPS.

**Live Application URL:** `https://student-records-api.onrender.com` *(Update with your Render live URL)*  
**Health Check Endpoint:** `https://student-records-api.onrender.com/api/health`

*[INSERT SCREENSHOT 7: Render Dashboard showing Live deployment status and Web GUI in browser]*  
*Figure 7: Deployed RESTful API running live on Render.*

---

## 9. Conclusion

The Student Records RESTful API Management System was successfully developed using Node.js, Express.js, and MongoDB. The system demonstrates robust REST architectural principles, strict database schema validation, structured error handling with appropriate HTTP status codes, and full CRUD operations. The project was version-controlled with Git, hosted on GitHub, deployed on Render, and comprehensively verified through Postman.

---

## 10. Learning Outcomes

- Understood the core principles of RESTful architecture, stateless communication, and HTTP status codes.
- Implemented back-end routing and middleware pipelines using Express.js.
- Designed database schemas and enforced data validation rules using Mongoose ODM.
- Mastered full CRUD (Create, Read, Update, Delete) database interactions.
- Gained hands-on experience writing and executing automated API tests in Postman.
- Configured environment variables and deployed a production web service on the Render cloud hosting platform.
