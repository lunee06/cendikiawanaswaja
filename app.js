const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors'); // Tambahkan ini
const { connectDB } = require('./db');
const {
    getAllQuestions,
    createQuestion,
    getPopularTags,
    searchQuestions,
    getQuestionById,
    getDiscussionsByTag,
    createComment,
    getCommentsByPostId,
    createReply
} = require('./controllers/forumController');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Tambahkan ini
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
    app.post('/questions', upload.single('image'), createQuestion);
    app.get('/tags/popular', getPopularTags);
    app.get('/search', searchQuestions);
    app.get('/questions/:id', getQuestionById);
    app.get('/tags/:tagName', getDiscussionsByTag);
    app.post('/questions/:questionId/comments', createComment);
    app.get('/questions/:questionId/comments', getCommentsByPostId);
    app.post('/questions/:questionId/comments/:commentId/replies', createReply);

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
