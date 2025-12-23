# ExpenseShare Backend

This is the backend server for the ExpenseShare application. It provides the RESTful API for user management, group coordination, expense tracking, and the core debt simplification algorithm.

## Technology Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)

## Project Structure

```text
backend/
├── config/
│   └── db.js               # Database connection configuration
├── controllers/
│   ├── expenseController.js # Logic for adding expenses and calculating balances
│   ├── groupController.js   # Logic for group creation and retrieval
│   └── userController.js    # Logic for user registration and login
├── models/
│   ├── Expense.js          # Mongoose schema for expenses and splits
│   ├── Group.js            # Mongoose schema for user groups
│   └── User.js             # Mongoose schema for app users
├── routes/
│   ├── expenseRoutes.js    # API routes for expense operations
│   ├── groupRoutes.js      # API routes for group operations
│   └── userRoutes.js       # API routes for user operations
├── .env                    # Environment variables (Port, Mongo URI)
├── package.json            # Project dependencies and scripts
└── server.js               # Application entry point and server configuration
```

## Key Features

-   **REST API**: Structured endpoints for interacting with the database.
-   **Debt Simplification Algorithm**: Optimized logic (Min-Cash-Flow) to reduce the total number of transactions needed to settle up.
-   **Split Management**:  Supports Equal, Exact, and Percentage based expense splitting.
-   **Settlement Processing**: Handles the recording of payments and updating of balances.
-   **Simulated Auth**: Simple email-based login system for demonstration purposes.

## How to Run Locally

1.  **Navigate to the directory**:
    ```bash
    cd backend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Environment**:
    Ensure a `.env` file exists in the `backend` folder with the following details:
    ```env
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/expenseshare
    NODE_ENV=development
    ```

4.  **Start the Server**:
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:5001`.
