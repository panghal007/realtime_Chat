# API Documentation

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


# Setup and Run Instructions

Here are the setup and run instructions for the project:

1. **Clone the Repository:**  
   Use the command `git clone https://github.com/panghal007/realtime_Chat` to clone the repository to your local machine.

2. **Install Dependencies:**  
   Navigate into the project directory and run `npm install` to install the necessary dependencies.

3. **Set Up Environment Variables:**  
   Create a `.env` file in the root directory of the project. Add the following lines to the file, replacing the placeholders with your actual values:
   - `REACT_APP_GOOGLE_AI_KEY`="your_google_ai_key_here"
   - `JWT_SECRET`="your_jwt_secret_here"
   - `MONGODB_URI`="your_mongodb_uri_here"

4. **Start the Backend:**  
Run `node index.js` to start the backend server. It will run on [http://localhost:5000](http://localhost:5000).

5. **Start the Frontend:**  
In a new terminal window, navigate to the frontend directory and run `yarn dev` to start the frontend application. It will run on [http://localhost:5173](http://localhost:5173).

--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


## Overview

This document provides information about the endpoints available in the user management API.

## Base URL

All endpoints are relative to the base URL: `/api/users`


## Endpoints

### 1. Register a New User

- **Route:** `POST /signup`
- **Description:** This route is used to register a new user.
- **Expected Input:** 
  - A JSON object in the request body with the following fields:
    - `email`: The email of the user.
    - `password`: The password of the user.
- **Logic:**
  - The function `signup` is called when a POST request is made to `/signup`.
  - It checks if a user with the provided email already exists. 
  - If the user doesn't exist, it hashes the password and creates a new User object with the provided email and hashed password.
  - It attempts to save this User object to the database.
- **Expected Output:** 
  - If the user is registered successfully, the server responds with a 201 status code and a JSON object with a success message:
    ```json
    {
      "message": "User registered successfully"
    }
    ```
  - If there's an error, the server responds with a 500 status code and a JSON object with an error message:
    ```json
    {
      "message": "Internal server error"
    }
    ```
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 2. Log In User

- **Route:** `POST /login`
- **Description:** This route is used to log in a user.
- **Expected Input:** 
  - A JSON object in the request body with the following fields:
    - `email`: The email of the user.
    - `password`: The password of the user.
- **Logic:**
  - The function `login` is called when a POST request is made to `/login`.
  - It attempts to find a user in the database with the provided email.
  - If a user is found, it verifies the provided password with the hashed password stored in the database.
  - If the password is valid, it generates a JWT token with the user's ID as the payload.
- **Expected Output:** 
  - If the user is logged in successfully, the server responds with a 200 status code and a JSON object containing the JWT token:
    ```json
    {
      "token": "<JWT token>"
    }
    ```
  - If there's an error, the server responds with a 500 status code and a JSON object with an error message:
    ```json
    {
      "message": "Internal server error"
    }
    ```
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 3. Fetch All Users

- **Route:** `GET /getusers`
- **Description:** This route is used to fetch all users.
- **Expected Input:** This route does not expect any input in the request body.
- **Logic:**
  - The function `getUsers` is called when a GET request is made to `/`.
  - It attempts to find all users in the database.
- **Expected Output:** 
  - If the users are fetched successfully, the server responds with a 200 status code and a JSON array of users.
    ```json
    [
      {
        "_id": "<user_id>",
        "email": "<user_email>",
        "password": "<hashed_password>",
        "__v": 0
      },
      {
        "_id": "<user_id>",
        "email": "<user_email>",
        "password": "<hashed_password>",
        "__v": 0
      }
    ]
    ```
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 4. Fetch Messages Between Users

- **Route:** `GET /messages/:senderId/:recipientId`
- **Description:** This route is used to fetch all messages between two users.
- **Expected Input:** This route expects two parameters in the URL:
  - `senderId`: The ID of the user who sent the messages.
  - `recipientId`: The ID of the user who received the messages.
- **Logic:**
  - The function `getMessages` is called when a GET request is made to `/messages/:senderId/:recipientId`.
  - It extracts the `senderId` and `recipientId` from the request parameters.
  - It attempts to find all messages in the database where the sender is `senderId` and the recipient is `recipientId`, or the sender is `recipientId` and the recipient is `senderId`.
- **Expected Output:** 
  - If the messages are fetched successfully, the server responds with a 200 status code and a JSON array of messages:
    ```json
    [
      {
        "_id": "<message_id>",
        "content": "Hello, world!",
        "sender": "userId1",
        "recipient": "userId2",
        "__v": 0
      },
      {
        "_id": "<message_id>",
        "content": "Hi, how are you?",
        "sender": "userId2",
        "recipient": "userId1",
        "__v": 0
      }
    ]
    ```
  - If there's an error, the server responds with a 500 status code and a JSON object with an error message:
    ```json
    {
      "message": "Internal server error"
    }
    ```
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 5. Fetch User Status

- **Route:** `GET /:userId/status`
- **Description:** This route is used to fetch the status of a user.
- **Expected Input:** This route expects one parameter in the URL:
  - `userId`: The ID of the user whose status is to be fetched.
- **Logic:**
  - The function `getUserStatus` is called when a GET request is made to `/users/:userId/status`.
  - It extracts the `userId` from the request parameters.
  - It attempts to find the user in the database with the provided `userId`.
- **Expected Output:** 
  - If the user's status is fetched successfully, the server responds with a 200 status code and a JSON object containing the user's status:
    ```json
    {
      "status": "AVAILABLE"
    }
    ```
  - If there's an error, the server responds with a 500 status code and a JSON object with an error message:
    ```json
    {
      "message": "Internal server error"
    }
    ```
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 6. Update User Status

- **Route:** `PUT /:userId/status`
- **Description:** This route is used to update the status of a user.
- **Expected Input:** This route expects one parameter in the URL and a JSON object in the request body:
  - `userId`: The ID of the user whose status is to be updated.
  - `status`: The new status of the user.
    ```json
    {
      "status": "BUZY"
    }
    ```
- **Logic:**
  - The function `updateUserStatus` is called when a PUT request is made to `/users/:userId/status`.
  - It extracts the `userId` from the request parameters and the `status` from the request body.
  - It attempts to find the user in the database with the provided `userId` and update their status. If no such user is found, it sends a 404 status code and an error message back to the client.
- **Expected Output:** 
  - If the user's status is updated successfully, the server responds with a 200 status code and a JSON object with a success message:
    ```json
    {
      "message": "User status updated successfully"
    }
    ```
  - If there's an error, the server responds with a 500 status code and a JSON object with an error message:
    ```json
    {
      "message": "Internal server error"
    }
    ```
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

### 7. Store Chat Message

- **Route:** `POST /messages`
- **Description:** This route is used to store a chat message in the database.
- **Expected Input:** 
  - A JSON object in the request body with the following fields:
    - `content`: The content of the message.
    - `sender`: The ID of the user who sent the message.
    - `recipient`: The ID of the user who is the recipient of the message.
    ```json
    {
      "content": "Hello, world!",
      "sender": "userId1",
      "recipient": "userId2"
    }
    ```
- **Logic:**
  - The function `storeMessage` is called when a POST request is made to `/messages`.
  - It extracts the `content`, `sender`, and `recipient` fields from the request body.
  - It creates a new Message object with these fields.
  - It attempts to save this Message object to the database.
- **Expected Output:** 
  - If the message is stored successfully, the server responds with a 201 status code and a JSON object with a success message:
    ```json
    {
      "message": "Message stored successfully"
    }
    ```
  - If there's an error, the server responds with a 500 status code and a JSON object with an error message:
    ```json
    {
      "message": "Internal server error"
    }
    ```


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Environment Variables for React Application

This file contains environment variables for a React application. Here's a brief explanation:

- `REACT_APP_GOOGLE_AI_KEY:` This is the API key for Google AI services.

- `JWT_SECRET:` This is the secret key used to sign and verify JSON Web Tokens (JWTs) for authentication purposes.

- `MONGODB_URI:` This is the connection string for a MongoDB database hosted on MongoDB Atlas. It includes the username, password, and the name of the cluster.

Remember to replace these values with your own when setting up the application. Never expose these values publicly as they contain sensitive information.






