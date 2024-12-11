require("dotenv").config(); //loading environment variables

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
app.use(bodyParser.json());
// const { v4: uuidv4 } = require('uuid');



//setting up cors so that our backend server accepts request from our frontend 
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));




//Creating database connection
const db = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }
);


//Connect to database
db.connect((err) => {
    if(err) {
        console.log("Error Connecting to the database", err);
        return;
    }
    console.log("connected to the MySQL Database");
    
});


app.get('/userlist',(req, res)=>{
        const  q= "SELECT * FROM users ORDER BY first_name ASC;";
        db.query(q, (err, results)=>{
            if(err){
                console.log(err);

            }
            return res.json(results);
            
        })


})


app.post('/userlist', async (req, res) => {
  const q = "INSERT INTO users (`username`, `email`, `first_name`, `last_name`, `password`, `role`, `classification`) VALUES (?,?,?,?,?,?,?)";

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds); // Await the hash process

    const values = [
      req.body.username,
      req.body.email,
      req.body.first_name,
      req.body.last_name,
      hashedPassword, // Use the hashed password here
      req.body.role || 'Member',
      req.body.classification,
    ];

    // Execute the database query
    db.query(q, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error registering user', error: err });
      }
      return res.status(201).json({ message: 'User registered successfully!', results });
    });
  } catch (error) {
    console.error('Password hashing error:', error);
    return res.status(500).json({ message: 'Error hashing password', error });
  }
});

app.post('/login', async (req, res)=>{
  const {email, password}= req.body;
  const q = `select * from users where email = ?`;
  try {
    // Step 1: Check if the user exists in the database by their email
    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }

      // Step 2: If the user doesn't exist, return an error
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const user = results[0];

      // Step 3: Compare the entered password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Step 4: Password is correct, log the user in
      res.status(200).json({ message: 'Login successful' });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error });
  }




});




//delete a id
app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM users WHERE id = ?';
  
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Failed to delete user" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    });
  });
  
  //update an id
app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { username, first_name, last_name, email, role, classification} = req.body;
    const query = 'UPDATE users SET username = ?, first_name = ?, last_name = ?, email = ?, role = ?, classification = ? WHERE id = ?';
  
    db.query(query, [username, first_name, last_name, email, role,  classification, userId  ], (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Failed to update user" });
      } else {
        res.status(200).json({ message: "User updated successfully" });
      }
    });
  });
  

//setting routes
app.get("/", (req, res) => {
    //res.redirect("http://localhost:5173/");
    res.send("hello");
    console.log("redirected successful");
});


// eventsCategory Names matra from Event events_category table
app.get('/eventscategory',(req, res)=>{
  const  q= "SELECT * FROM events_category;";
  db.query(q, (err, results)=>{
      if(err){
          console.log(err);

      }
      return res.json(results);
      
  })


})

//added at last by Sagar. Ask him why. This is basically to show the category inside all events
app.get('/eventscategory/:category_id', (req, res) => {
  const { category_id } = req.params;
  const query = 'SELECT category FROM events_category WHERE category_id = ?';

  db.query(query, [category_id], (err, results) => {
    if (err) {
      console.error('Error fetching category:', err);
      return res.status(500).json({ message: 'Failed to fetch category' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(results[0]); // Return the category name
  });
});


//get events details for Event Details component from events_list table 
app.get('/eventslist', (req, res) => {
  const q = "SELECT * FROM events_list";

  db.query(q, (err, results) => {
    if(err){
      console.log(err);
    }
    return res.json(results);
  })
})



app.get('/eventslist/:category_id', (req, res) => {
  const { category_id } = req.params;
  const query = 'SELECT * FROM events_list WHERE category_id = ? ORDER BY event_name DESC';

  db.query(query, [category_id], (err, results) => {
    if (err) {
      console.error('Error fetching events:', err);
      return res.status(500).json({ message: 'Failed to fetch events' });
    }
    res.status(200).json(results);
  });
});


//add event category to event_category table
app.post('/eventscategory', (req, res) => {
  const { category } = req.body;
  const query = 'INSERT INTO events_category (category) VALUES (?)';
  
  db.query(query, [category], (err, result) => {
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



//delete a id
app.delete('/eventscategory/:id', (req, res) => {
  const categoryId = req.params.id;
  const query = 'DELETE FROM events_category WHERE category_id = ?';

  db.query(query, [categoryId], (err, result) => {
    if (err) {
      console.error("Error deleting category:", err);
      res.status(500).json({ message: "Failed to delete category" });
    } else {
      res.status(200).json({ message: "Category deleted successfully" });
    }
  });
});


app.post('/eventslist', (req, res) => {
  const { category_id, event_name } = req.body;

  // Validate input
  if (!category_id || !event_name) {
    return res.status(400).json({ message: 'Invalid data. category_id and event_name are required.' });
  }

  const query = 'INSERT INTO events_list (`category_id`, `event_name`) VALUES (?, ?)';

  db.query(query, [category_id, event_name], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        // Duplicate event_name within the same category detected
        return res.status(409).json({ 
          message: `The event "${event_name}" already exists in category ${category_id}.` 
        });
      }
      console.error('Error inserting event:', err);
      return res.status(500).json({ message: 'Failed to add Event' });
    }
    res.status(201).json({ message: 'Event added successfully' });
  });
});

//delete event from events_list based on event_name
app.delete('/eventslist/:id', (req, res) => {
  const eventId = req.params.id;
  const query = 'DELETE FROM events_list WHERE event_id = ?';

  db.query(query, [eventId], (err, result) => {
    if (err) {
      console.error("Error deleting event:", err);
      res.status(500).json({ message: "Failed to delete event" });
    } else {
      res.status(200).json({ message: "Event deleted event" });
    }
  });
});


app.put('/eventscategory/:id', (req, res) => {
  const categoryId = req.params.id; // Extract the id from the route
  const { category } = req.body; // Extract only the category from the request body

  const query = 'UPDATE events_category SET category = ? WHERE category_id = ?';

  db.query(query, [category, categoryId], (err, result) => {
    if (err) {
      console.error("Error updating category:", err);
      res.status(500).json({ message: "Failed to update category" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Category not found" });
    } else {
      res.status(200).json({ message: "Category updated successfully" });
    }
  });
});



//For editing the event details in Event Detail Component
// Update event details in the events_list table
app.put('/eventslist/:id', (req, res) => {
  const eventId = req.params.id;
  const { event_name, event_date, location, budget, links, event_documentation, event_image } = req.body;

  const query = `
    UPDATE events_list
    SET event_name = ?, event_date = ?, location = ?, budget = ?, links = ?, event_documentation = ?, event_image = ?
    WHERE event_id = ?`;

  db.query(
    query,
    [event_name, event_date, location, budget, links, event_documentation, event_image, eventId],
    (err, result) => {
      if (err) {
        console.error('Error updating event:', err);
        return res.status(500).json({ message: 'Failed to update event.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Event not found.' });
      }
      res.status(200).json({ message: 'Event updated successfully.' });
    }
  );
});





// Adding a route to push rating number to database
app.post("/add-review", (req, res) => {
  const {review, event_id, event_name, rating} = req.body;
  const q = "INSERT INTO reviews (review, event_id, event_name, rating) VALUES (?,?,?, ?)"
  
  db.query(q, [review, event_id, event_name, rating], (err, result) => {
    if(err){
      return res.status(500).json({message: 'Failed to add review'});
    }
    res.status(201).json({message: "Review Added Successfully"});
  });
});

// Adding a route to FETCH the data from review table
app.get("/fetch-reviews", (req, res) => {
  const q = "SELECT event_id, review, rating FROM reviews";
  db.query(q, (err, results) => {
    if(err){
      console.error("Error fetching reviews: ", err);
      return res.status(500).json({message: "Error Fetching Reviews"});
    }
    res.status(200).json(results);
  });
});




app.listen(8080, () => {
    console.log("Server started on port 8080");
})
