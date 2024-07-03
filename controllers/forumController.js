const { ObjectId } = require('mongodb');
const getDB = require('../db').getDB;
const moment = require('moment');

async function getAllQuestions(req, res, next) {
    const { sort, page = 1, perPage = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(perPage); // Hitung jumlah data yang akan dilewati
    const limit = parseInt(perPage); // Jumlah data per halaman

    try {
        const db = getDB(); // Mendapatkan koneksi database
        
        let sortOptions = { createdAt: -1 }; // Default: urutkan berdasarkan terbaru
        if (sort === 'oldest') {
            sortOptions = { createdAt: 1 }; // Jika sort === 'oldest', urutkan berdasarkan terlama
        }

        // Menghitung jumlah total pertanyaan
        const totalQuestions = await db.collection('questions').countDocuments();

        // Menghitung jumlah halaman
        const totalPages = Math.ceil(totalQuestions / perPage);

        const questions = await db.collection('questions')
            .find()
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .toArray();

        const formattedQuestions = questions.map(question => formatQuestionTimestamp(question)); // Format timestamp
        res.json({ 
            message: "Successfully fetched questions", 
            questions: formattedQuestions, 
            currentPage: parseInt(page), 
            totalPages 
        });
    } catch (error) {
        console.error('Error fetching questions from MongoDB:', error);
        res.status(500).json({ error: "Failed to fetch questions" });
    }
}



async function createQuestion(req, res, next) {
    const { title, description, tags } = req.body;
    const tagsArray = tags.split(' ').filter(tag => tag.trim() !== ''); // Split string into array based on space and filter out empty strings
    
    // Pastikan imageUrl diambil dari file yang diunggah (jika ada)
    let imageUrl;
    if (req.file) {
        imageUrl = req.file.path; // Path tempat gambar disimpan
    }

    try {
        const db = getDB(); // Mendapatkan koneksi database
        const result = await db.collection('questions').insertOne({ 
            title, 
            description, 
            tags: tagsArray, 
            imageUrl, // Simpan path gambar di sini
            createdAt: new Date() 
        });
        
        if (result.insertedId) {
            const createdAt = new Date(); // Waktu pembuatan
            const question = { 
                _id: result.insertedId, 
                title, 
                description, 
                tags: tagsArray, 
                imageUrl, 
                createdAt 
            };
            const formattedQuestion = formatQuestionTimestamp(question); // Format timestamp
            res.json({ message: "Question created successfully", question: formattedQuestion });
        } else {
            throw new Error('Failed to insert question');
        }
    } catch (error) {
        console.error('Error creating question in MongoDB:', error);
        res.status(500).json({ error: "Failed to create question" });
    }
}



async function getPopularTags(req, res, next) {
    try {
        const db = getDB(); // Mendapatkan koneksi database
        const pipeline = [
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ];

        const result = await db.collection('questions').aggregate(pipeline).toArray();
        const popularTags = result.map(tag => ({
            name: tag._id,
            count: tag.count,
            link: `/tags/${encodeURIComponent(tag._id)}` // Link ke halaman atau endpoint terkait tag
        }));

        res.json({ message: "Successfully fetched popular tags", tags: popularTags });
    } catch (error) {
        console.error('Error fetching popular tags from MongoDB:', error);
        res.status(500).json({ error: "Failed to fetch popular tags" });
    }
}

async function getDiscussionsByTag(req, res, next) {
    const { tagName } = req.params;
    const page = parseInt(req.query.page) || 1; // Ambil nilai halaman dari query, default: halaman 1
    const pageSize = parseInt(req.query.pageSize) || 10; // Ambil ukuran halaman dari query, default: 10

    try {
        const db = getDB(); // Dapatkan koneksi database
        const skip = (page - 1) * pageSize; // Hitung nilai skip berdasarkan halaman dan ukuran halaman
        
        // Query untuk mendapatkan jumlah total data
        const countQuery = await db.collection('questions').find({ tags: tagName }).count();
        
        // Query untuk mendapatkan data dengan pagination
        const discussions = await db.collection('questions')
            .find({ tags: tagName })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        // Menghitung total halaman berdasarkan jumlah total data dan ukuran halaman
        const totalPages = Math.ceil(countQuery / pageSize);

        res.json({ 
            message: `Successfully fetched discussions for tag "${tagName}"`, 
            discussions,
            totalPages,
            currentPage: page,
            pageSize
        });
    } catch (error) {
        console.error(`Error fetching discussions for tag "${tagName}" from MongoDB:`, error);
        res.status(500).json({ error: `Failed to fetch discussions for tag "${tagName}"` });
    }
}


async function searchQuestions(req, res, next) {
    const { keyword } = req.query;
    try {
        const db = getDB(); // Mendapatkan koneksi database
        const regex = new RegExp(keyword, 'i'); // Regex untuk pencarian case-insensitive

        const results = await db.collection('questions').find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        }).toArray();

        const formattedResults = results.map(question => formatQuestionTimestamp(question)); // Format timestamp
        res.json({ message: `Successfully fetched search results for "${keyword}"`, results: formattedResults });
    } catch (error) {
        console.error(`Error searching questions for "${keyword}" from MongoDB:`, error);
        res.status(500).json({ error: `Failed to search questions for "${keyword}"` });
    }
}

async function getQuestionById(req, res, next) {
    const { id } = req.params;
    try {
        const db = getDB(); // Mendapatkan koneksi database
        const question = await db.collection('questions').findOne({ _id: new ObjectId(id) });
        
        if (question) {
            const formattedQuestion = formatQuestionTimestamp(question); // Format timestamp
            res.json({ message: "Successfully fetched question details", question: formattedQuestion });
        } else {
            res.status(404).json({ error: "Question not found" });
        }
    } catch (error) {
        console.error(`Error fetching question by ID from MongoDB:`, error);
        res.status(500).json({ error: "Failed to fetch question details" });
    }
}

// Function to format timestamp to "x time ago"
function formatQuestionTimestamp(question) {
    const now = moment();
    const createdAt = moment(question.createdAt);
    const diffMinutes = now.diff(createdAt, 'minutes');
    
    if (diffMinutes < 60) {
        return { ...question, formattedCreatedAt: `${diffMinutes} menit yang lalu` };
    } else {
        const diffHours = now.diff(createdAt, 'hours');
        return { ...question, formattedCreatedAt: `${diffHours} jam yang lalu` };
    }
}

module.exports = {
    getAllQuestions,
    createQuestion,
    getPopularTags,
    searchQuestions,
    getQuestionById,
    getDiscussionsByTag
};
