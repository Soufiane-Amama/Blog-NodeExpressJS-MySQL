const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const PORT = 3000;
const url = `http://localhost:${PORT}`;


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err, resul)=>{
  if(err){
    throw err;
  }
    console.log(`Connected successfully to the database! ${resul}`);
});

 app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.static("../client"));
const path = require("path");

const clientPath = path.join(__dirname, "../client");
app.use(express.static(clientPath));



app.get("/", (req, res) => {
  connection.query("SELECT post_id, title FROM Posts", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result); // إرجاع عناوين المنشورات فقط
    }
  });
});

app.get("/post/:post_id", (req, res) => {
  const postId = req.params.post_id;
  connection.query("SELECT * FROM Posts WHERE post_id=?", postId, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result[0]); // إرجاع المنشور الخاص بالـ ID المحدد
    }
  });
});

// app.get("/", (req, res)=>{
//   connection.query("SELECT * FROM Posts", (err, result)=>{
//     if(err){
//       console.log(err);
//     }else{
//      res.send(result);
//     }
//   });
// });

// 1. إضافة منشور جديد:
app.post("/add-post", (req, res) => {
  const { title, content } = req.body;
  const sqlQuery = "INSERT INTO Posts (title, content) VALUES (?, ?)";
  connection.query(sqlQuery, [title, content], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding new post!");
    } else {
      console.log("New post added successfully!");
      res.send("New post added successfully!");
    }
  });
});


// 2. إضافة تعليق على منشور معين:
app.post("/add-comment/:postId", (req, res) => {
  const { postId } = req.params;
  const { commentText } = req.body;
  const sqlQuery = "INSERT INTO Comments(post_id, comment_text) VALUES(?, ?)";
  connection.query(sqlQuery,
     [postId, commentText], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding new comment!");
    } else {
      console.log("New comment added successfully!");
      res.send("New comment added successfully!");
    }
  });
});


// 3. عرض جميع التعليقات على منشور معين:
app.get("/comments/:postId", (req, res) => {
  const { postId } = req.params;
  const sqlQuery = "SELECT * FROM Comments WHERE post_id = ?";
  connection.query(sqlQuery, [postId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving comments!");
    } else {
      console.log(result);
      res.send(result);
    }
  });
});



// connection.end();

app.listen(PORT, ()=>{
  console.log(`Server has started on PORT ${PORT}...`);
});
