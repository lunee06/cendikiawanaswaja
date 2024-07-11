require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');
const { connectDB } = require('./db'); // Mengimpor dengan destructuring

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
const port = process.env.PORT || 3000; // Tambahkan env variable untuk port

// Middleware
app.use(cors());
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


// Load file YAML
const swaggerDocument = YAML.load(path.join(__dirname, 'api-docs.yaml'));

// Setup middleware untuk Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Connect to MongoDB
connectDB()
    .then(() => {
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

        // auth routes (example)
        app.use('/api/auth', require('./routes/auth'));

        // Handling 404 Not Found
        app.use((req, res) => {
            res.status(404).send('404 Not Found');
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });
