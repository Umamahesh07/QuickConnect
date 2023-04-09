//importing all the required packages
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const xml2js = require('xml2js');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const app = express();
app.set('view engine', 'ejs');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
require('dotenv').config();


// creating connection to the database
const pool = mysql.createPool({
  host: process.env.HOST,
  user: 'root',
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// Assigning required objects to global namespace
global.pool = pool; 
global.upload = upload;
global.xml2js = xml2js;


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

// making a public directory if incase we have static files
app.use(express.static(path.join(__dirname, 'public')));

// importing route handlers
const index = require('./routes/index');
const addData = require('./routes/add_data');
const viewUpdate = require('./routes/view_update');
const uploadxml = require('./routes/uploadxml');

// creating routes 
app.get('/', index.getHome);
app.get('/add-data', addData.getAdd);
app.post('/add-data', addData.postAdd);
app.get('/view-update', viewUpdate.getUpdate);
app.post('/update-orders', viewUpdate.postUpdate);
app.get('/upload-xml', uploadxml.getUploadxml);
app.post('/upload-xml/upload', uploadxml.postUploadxmlMiddleware, uploadxml.postUploadxml);

// Setting the port number from the environment variables or if not defined use the default port (9000)
const port = process.env.PORT || 9000;

// Starting the server and listen from specified port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
