const express = require("express");
const app = express();
const cors = require("cors");


//setting up cors so that our backend server accepts request from our frontend 
const corsOptions = {
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));


//setting routes
app.get("/", (req, res) => {
    res.send("Server Home");
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
})
