
require("dotenv").config(); // Load environment variables

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const fs = require("fs");



app.use(bodyParser.json());

// Set up CORS to allow requests from the frontend
const corsOptions = {
  origin: ["http://localhost:5173"], // Frontend URL
};
app.use(cors(corsOptions));

// Set up rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});
app.use(limiter);

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test",
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your server's capacity
  queueLimit: 0,
  ssl: {
   
    ca: process.env.SSL_CA_PATH ? fs.readFileSync(process.env.SSL_CA_PATH) : undefined,
    rejectUnauthorized: process.env.SSL_REJECT_UNAUTHORIZED === "true",
  }
});
// Test the database connection when the server starts
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
    process.exit(1);
  } else {
    console.log("Database connected successfully!");
    connection.release();
  }
});

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied, no token provided" });
  }
  jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret", (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user; // Attach decoded user info to the request
    next();
  });
};

// Middleware for role-based access
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user; // This is set in `authenticateToken`
    if (user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied. Insufficient privileges." });
    }
    next();
  };
};

// Centralized error handler
const handleError = (res, status, message) => {
  return res.status(status).json({ message });
};

// Login route with JWT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND verified = 1";
  try {
    const [results] = await pool.promise().query(query, [email]);
    if (results.length === 0) {
      return handleError(res, 400, "Invalid credentials");
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return handleError(res, 400, "Invalid credentials");
    }

    // Generate JWT with role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    handleError(res, 500, "An error occurred during login");
  }
});

//base route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API. The server is running." });
});

// Register a new user and send OTP
app.post("/userlist", async (req, res) => {
  const { username, email, first_name, last_name, password, role, classification } = req.body;

  // Validate input fields
  if (!email || !password || !username || !first_name || !last_name) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Ensure the role is valid
  const validRoles = ["Member", "Board Member", "President", "Vice President"];
  if (role && !validRoles.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Valid roles are: ${validRoles.join(", ")}` });
  }

  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the database with OTP and `verified` as false
    const query =
      "INSERT INTO users (username, email, first_name, last_name, password, role, classification, verified, otp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      username,
      email,
      first_name,
      last_name,
      hashedPassword,
      role || "Member", // Default role to "Member"
      classification || "Other", // Default classification to "Other"
      false, // Set verified to false
      otp, // Save OTP
    ];
    await pool.promise().query(query, values);

    // Send the OTP to the user's email
    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password
              },
    });

    await transporter.sendMail({
      from: '"NSA Events" <' + process.env.EMAIL_USER + '>',
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b></p>`,
    });

    res.status(201).json({ message: "Registration successful! OTP has been sent to your email address." });
  } catch (err) {
     // Check for duplicate entry error (e.g., duplicate username or email)
     if (err.code === "ER_DUP_ENTRY") {
      if (err.sqlMessage.includes("username")) {
        return res.status(409).json({ message: "Username already exists. Please choose a different username." });
      } else if (err.sqlMessage.includes("email")) {
        return res.status(409).json({ message: "Email already exists. Please use a different email address." });
      }
    }

    console.error("Error registering user:", err);
    handleError(res, 500, "Error registering user");
  }
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  // Validate input
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required." });
  }

  try {
    // Check if the user exists and the OTP matches
    const query = "SELECT * FROM users WHERE email = ? AND otp = ?";
    const [results] = await pool.promise().query(query, [email, otp]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or OTP." });
    }

    // Update the user's verified status to true and clear the OTP
    const updateQuery = "UPDATE users SET verified = ?, otp = NULL WHERE email = ?";
    await pool.promise().query(updateQuery, [true, email]);

    res.status(200).json({ message: "Account verified successfully!" });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    handleError(res, 500, "Error verifying OTP");
  }
});

// Fetch all users (accessible only to President)
app.get("/userlist", authenticateToken, authorizeRole("President"), async (req, res) => {
  const query = "SELECT * FROM users WHERE username != 'maintain' ORDER BY first_name ASC";
  try {
    const [results] = await pool.promise().query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users." });
  }
});


// Only 'President' can delete users
app.delete("/users/:id", authenticateToken, authorizeRole("President"), async (req, res) => {
  const userId = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";
  try {
    await pool.promise().query(query, [userId]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    handleError(res, 500, "Failed to delete user");
  }
});

// Update a user's details
app.put("/users/:id", authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { username, first_name, last_name, email, role, classification } = req.body;
  const query =
    "UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ?, role = ?, classification = ? WHERE id = ?";
  try {
    await pool.promise().query(query, [username, first_name, last_name, email, role, classification, userId]);
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    handleError(res, 500, "Failed to update user");
  }
});

/////////////added from old///////////////////////
app.get('/eventscategory', async (req, res) => {
  const q = "SELECT * FROM events_category;";
  try {
    const [results] = await pool.promise().query(q);
    return res.json(results);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
});


app.get('/eventscategory/:category_id', async (req, res) => {
  const { category_id } = req.params;
  const query = 'SELECT category FROM events_category WHERE category_id = ?';

  try {
    const [results] = await pool.promise().query(query, [category_id]);
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(results[0]); // Return the category name
  } catch (err) {
    console.error('Error fetching category:', err);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

app.get('/eventslist', (req, res) => {
  const q = "SELECT * FROM events_list";

  pool.query(q, (err, results) => {
    if(err){
      console.log(err);
    }
    return res.json(results);
  })
})

//add event category to event_category table
app.post('/eventscategory', (req, res) => {
  const { category } = req.body;
  const query = 'INSERT INTO events_category (category) VALUES (?)';
  
  pool.query(query, [category], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry error
        return res.status(409).json({ message: 'Category already exists' });
      }
      console.error('Error inserting category:', err);
      return res.status(500).json({ message: 'Failed to add category' });
    }
    res.status(201).json({ message: 'Category added successfully' });
  });
});

//delete a eventcategory id
app.delete('/eventscategory/:id', async (req, res) => {
  const categoryId = req.params.id;
  const query = "DELETE FROM events_category WHERE category_id = ?";
  try {
    await pool.promise().query(query, [categoryId]);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

//////////////////////////////////////////////////////

// Add event
app.post("/eventslist", async (req, res) => {
  const { category_id, event_name } = req.body;
  if (!event_name || !category_id) {
    return res.status(400).json({ message: "Event name and category are required." });
  }

  const query = "INSERT INTO events_list (category_id, event_name) VALUES (?, ?)";
  try {
    await pool.promise().query(query, [category_id, event_name]);
    res.status(201).json({ message: "Event added successfully." });
  } catch (err) {
    if(err.code === "ER_DUP_ENTRY"){
        res.status(409).json({message: "Same event already exists! "})
    }
    else{
    console.error("Error adding event:", err);
    handleError(res, 500, "Error adding event.");
    }
  }
});

// Fetch events by category
app.get("/eventslist/:category_id", async (req, res) => {
  const categoryId = req.params.category_id;
  const query = "SELECT * FROM events_list WHERE category_id = ? ORDER BY event_name DESC";
  try {
    const [results] = await pool.promise().query(query, [categoryId]);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching events:", err);
    handleError(res, 500, "Error fetching events.");
  }
});
//put to be added here........................

// Delete event
app.delete("/eventslist/:event_id", async (req, res) => {
  const eventId = req.params.event_id;
  const query = "DELETE FROM events_list WHERE event_id = ?";
  try {
    await pool.promise().query(query, [eventId]);
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("Error deleting event:", err);
    handleError(res, 500, "Failed to delete event.");
  }
});

app.put('/eventscategory/:id', async (req, res) => {
  const categoryId = req.params.id; // Extract the id from the route
  const { category } = req.body; // Extract only the category from the request body

  // Validate required fields
  if (!category) {
    return res.status(400).json({ message: "Missing required field: category." });
  }

  const query = 'UPDATE events_category SET category = ? WHERE category_id = ?';

  try {
    // Execute the query using the pool
    const [result] = await pool.promise().query(query, [category, categoryId]);

    if (result.affectedRows === 0) {
      // If no rows are affected, the category does not exist
      return res.status(404).json({ message: "Category not found." });
    }

    // If the update is successful
    res.status(200).json({ message: "Category updated successfully." });
  } catch (err) {
    console.error("Error updating category:", err); // Log the error for debugging
    res.status(500).json({ message: "Failed to update category." });
  }
});


//For editing the event details in Event Detail Component
// Update event details in the events_list table
app.put('/eventslist/:id', async (req, res) => {
  const eventId = req.params.id;
  const { event_name, event_date, location, budget, links, event_documentation, event_image } = req.body;

  // Validate required fields
  if (!event_name || !event_date || !location || !budget) {
    return res.status(400).json({ message: "Missing required fields: event_name, event_date, location, or budget." });
  }
  const formattedDate = new Date(event_date).toISOString().split('T')[0];
  const query = `
    UPDATE events_list
    SET event_name = ?, event_date = ?, location = ?, budget = ?, links = ?, event_documentation = ?, event_image = ?
    WHERE event_id = ?`;

  try {
    const [result] = await pool.promise().query(query, [
      event_name,
      formattedDate,
      location,
      budget,
      links,
      event_documentation,
      event_image,
      eventId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json({ message: "Event updated successfully." });
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).json({ message: "Failed to update event." });
  }
});

app.post("/add-review", authenticateToken, async (req, res) => {
  const { review, event_id, event_name, rating, user_name } = req.body;

  // Validate input
  if (!review || !event_id || !event_name || !rating) {
    return res.status(400).json({ message: "All fields (review, event_id, event_name, rating, user_name) are required." });
  }

  // Ensure rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  const query = "INSERT INTO reviews (review, event_id, event_name, rating, user_name) VALUES (?, ?, ?, ?, ?)";

  try {
    await pool.promise().query(query, [review, event_id, event_name, rating, user_name]);
    res.status(201).json({ message: "Review added successfully." });
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Failed to add review." });
  }
});


// Adding a route to FETCH the data from review table
app.get("/fetch-reviews", async (req, res) => {
  const query = "SELECT event_id, review, rating, user_name FROM reviews"; // Check this query
  try {
    const [results] = await pool.promise().query(query); // Ensure `pool` is defined and used
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

//delete reviews

// Delete a review by review_id



//Calendar Events//

app.post("/up-events", (req, res) => {
  const{calendar_events, description, start_date, end_date} = req.body;

  const q = "INSERT INTO upcoming_events (calendar_events, description, start_date, end_date) VALUES (?,?,?,?)";
  pool.query(q, [calendar_events, description, start_date, end_date], (err, results) => {
    if(err){
      res.status(500).send("Failed to add event");
      return;
    }
    res.status(200).send("Event addedd sucessfully");
  });
});

app.get("/up-events", async (req, res) => {
  const query = `
    SELECT calendar_id, calendar_events AS title, description, start_date AS start, end_date AS end 
    FROM upcoming_events`;
  try {
    const [results] = await pool.promise().query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});


app.delete("/up-events/:calendar_id", async (req, res) => {
  const { calendar_id } = req.params; // Extract calendar_id
  const query = "DELETE FROM upcoming_events WHERE calendar_id = ?";
  try {
    const [result] = await pool.promise().query(query, [calendar_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Failed to delete event." });
  }
});



// Start the server
app.listen(8080, () => {
  console.log("Server started on port 8080");
});