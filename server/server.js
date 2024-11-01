require("dotenv").config(); //loading environment variables

const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

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


app.get('/dblist',(req, res)=>{
        const  q= "SELECT * FROM users;";
        db.query(q, (err, results)=>{
            if(err){
                console.log(err);

            }
            return res.json(results);
            
        })


})

app.post('/dblist', (req, res)=>{
    const q= "INSERT INTO users (`username`, `email`, `first_name`, `last_name`, `password`) VALUES (?,?,?,?,?)";
    const values= [req.body.username, 
        req.body.email,
        req.body.first_name,
        req.body.last_name,
        req.body.password
    ];
    
    db.query(q, values, (err, results)=>{
        if(err)console.log(err);
        return res.json(results);

    })

})

//setting routes
app.get("/", (req, res) => {
    //res.redirect("http://localhost:5173/");
    res.send("hello");
    console.log("redirected successful");
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
})
