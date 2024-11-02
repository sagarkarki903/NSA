require("dotenv").config(); //loading environment variables

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// Setting up CORS so that our backend server accepts requests from our frontend 
const corsOptions = {
    origin: ["http://localhost:5173"],
};
app.use(cors(corsOptions));

// Creating database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.log("Error Connecting to the database", err);
        return;
    }
    console.log("Connected to the MySQL Database");
});

// Route to get all users
app.get('/dblist', (req, res) => {
    const q = "SELECT * FROM users;";
    db.query(q, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database query error" });
        }
        return res.json(results);
    });
});

// Route to add a new user
app.post('/dblistAdd', (req, res) => {
    const { username, email, first_name, last_name, password, role, classification } = req.body;

    // First, check if the email exists
    const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailQuery, [email], (err, emailResults) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Database error" });
        }

        if (emailResults.length > 0) {
            // Email already exists
            return res.status(400).json({ error: "Email already exists" });
        }

        // Next, check if the username exists
        const checkUsernameQuery = "SELECT * FROM users WHERE username = ?";
        db.query(checkUsernameQuery, [username], (err, usernameResults) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Database error" });
            }

            if (usernameResults.length > 0) {
                // Username already exists
                return res.status(400).json({ error: "Username already exists" });
            }

            // If no duplicates, proceed with the insertion
            const insertQuery = "INSERT INTO users (`username`, `email`, `first_name`, `last_name`, `password`, `role`, `classification`) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [username, email, first_name, last_name, password, role, classification];

            db.query(insertQuery, values, (err, results) => {
                if (err) {
                    console.error("Database insert error:", err);
                    return res.status(500).json({ error: "Failed to create account" });
                }
                res.json({ message: "User added successfully", results });
            });
        });
    });
});


// Root route
app.get("/", (req, res) => {
    res.send("Hello, welcome to the backend server!");
    console.log("Redirected successfully");
});

// Start the server
app.listen(8080, () => {
    console.log("Server started on port 8080");
});
