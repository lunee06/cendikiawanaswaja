// app.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const { connectDB } = require('./db'); // Import connectDB function from db.js
const { getAllQuestions, createQuestion, getPopularTags, searchQuestions, getQuestionById, getDiscussionsByTag } = require('./controllers/forumController'); // Adjust path based on your project structure

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Connect to MongoDB
connectDB().then(() => {
    // Routes setup after database connection
    app.get('/', (req, res) => {
        res.send('Welcome to the Forum API');
    });

    app.get('/questions', getAllQuestions);
    app.post('/questions', upload.single('image'), createQuestion); // Modify to include multer middleware
    app.get('/tags/popular', getPopularTags);
    app.get('/search', searchQuestions);
    app.get('/questions/:id', getQuestionById);
    app.get('/tags/:tagName', getDiscussionsByTag); // Route untuk daftar diskusi berdasarkan tag


    // Static files (example: uploaded images)
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the process if MongoDB connection fails
});
