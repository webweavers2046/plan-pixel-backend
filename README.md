# Task Management API

This project offers APIs to manage tasks through MongoDB. Below are instructions on how to work with these APIs.

## MongoDB Configuration

1. In the `db` folder, locate the `mongoClient/createMongoClient.js` file.
2. Update the MongoDB URI based on your environment:
   - For Atlas (Cloud): Set the `mongodbCloudUri` variable.
   - For Compass (Local): Set the `mongodbLocalUri` variable.

## Routes Initialization

1. In the `src/routes/index.js` file, the routes are defined for task management.
2. This file connects to MongoDB, creates necessary collections, and initializes three APIs:
   - `GET /tasks`: Retrieve all tasks.
   - `POST /createTask`: Create a new task.
   - `PUT /updateTask/:id`: Update an existing task.

## Task Controllers

### Create Task

1. To create a new task, use the `POST /createTask` API.
2. Send a POST request to this endpoint with the task details in the request body.

### Update Task

1. To update an existing task, use the `PUT /updateTask/:id` API.
2. Send a PUT request to this endpoint with the task ID as a parameter (`:id`) and the updated task details in the request body.

### Read Tasks

1. The `GET /tasks` API retrieves all tasks.
2. Send a GET request to this endpoint to fetch the list of tasks.

---

