const questionModel = require('../models/questionModel');
const moment = require('moment');

// Function to format timestamp to "x time ago"
function formatTimestamp(timestamp) {
    const now = moment();
    const createdAt = moment(timestamp);
    const diffMinutes = now.diff(createdAt, 'minutes');
    
    if (diffMinutes < 60) {
        return `${diffMinutes} menit yang lalu`;
    } else {
        const diffHours = now.diff(createdAt, 'hours');
        return `${diffHours} jam yang lalu`;
    }
}

async function getAllQuestions(req, res, next) {
    try {
        const { sort, page = 1, perPage = 10 } = req.query;
        const questions = await questionModel.getAllQuestions(sort, page, perPage);

        const formattedQuestions = questions.map(question => ({
            ...question,
            formattedCreatedAt: formatTimestamp(question.createdAt)
        }));

        res.json({ 
            message: "Successfully fetched questions", 
            questions: formattedQuestions, 
            currentPage: parseInt(page), 
            totalPages: questionModel.getTotalPages(perPage)
        });
    } catch (error) {
        console.error('Error fetching questions from MongoDB:', error);
        res.status(500).json({ error: "Failed to fetch questions" });
    }
}

async function createQuestion(req, res, next) {
    try {
        const { title, description, tags, imageUrl } = req.body;
        const createdQuestion = await questionModel.createQuestion(title, description, tags, imageUrl);

        res.json({ message: "Question created successfully", question: createdQuestion });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({ error: 'Failed to create question' });
    }
}

async function getPopularTags(req, res, next) {
    try {
        const popularTags = await questionModel.getPopularTags();

        res.json({ message: "Successfully fetched popular tags", tags: popularTags });
    } catch (error) {
        console.error('Error fetching popular tags from MongoDB:', error);
        res.status(500).json({ error: "Failed to fetch popular tags" });
    }
}

async function getDiscussionsByTag(req, res, next) {
    try {
        const { tagName } = req.params;
        const { page = 1, pageSize = 10 } = req.query;
        const discussions = await questionModel.getDiscussionsByTag(tagName, page, pageSize);

        res.json({ 
            message: `Successfully fetched discussions for tag "${tagName}"`, 
            discussions,
            totalPages: questionModel.getTotalTagPages(tagName, pageSize),
            currentPage: parseInt(page),
            pageSize
        });
    } catch (error) {
        console.error(`Error fetching discussions for tag "${tagName}" from MongoDB:`, error);
        res.status(500).json({ error: `Failed to fetch discussions for tag "${tagName}"` });
    }
}

async function searchQuestions(req, res, next) {
    try {
        const { keyword } = req.query;
        const searchResults = await questionModel.searchQuestions(keyword);

        const formattedResults = searchResults.map(question => ({
            ...question,
            formattedCreatedAt: formatTimestamp(question.createdAt)
        }));

        res.json({ message: `Successfully fetched search results for "${keyword}"`, results: formattedResults });
    } catch (error) {
        console.error(`Error searching questions for "${keyword}" from MongoDB:`, error);
        res.status(500).json({ error: `Failed to search questions for "${keyword}"` });
    }
}

async function getQuestionById(req, res, next) {
    try {
        const { id } = req.params;
        const question = await questionModel.getQuestionById(id);

        if (question) {
            const formattedQuestion = {
                ...question,
                formattedCreatedAt: formatTimestamp(question.createdAt)
            };
            res.json({ message: "Successfully fetched question details", question: formattedQuestion });
        } else {
            res.status(404).json({ error: "Question not found" });
        }
    } catch (error) {
        console.error(`Error fetching question by ID from MongoDB:`, error);
        res.status(500).json({ error: "Failed to fetch question details" });
    }
}

async function createComment(req, res, next) {
    try {
        const { questionId } = req.params;
        const { username, text } = req.body;
        const parentId = req.body.parentId; // Jika membutuhkan parentId dari body request

        // Panggil fungsi createComment dengan nilai yang sudah diterima dari body request
        const comment = await questionModel.createComment(questionId, username, text, parentId);

        res.json({ message: parentId ? 'Reply added successfully' : 'Comment added successfully', comment });
    } catch (error) {
        console.error('Error adding comment or reply:', error);
        res.status(500).json({ error: 'Failed to add comment or reply' });
    }
}


async function getCommentsByPostId(req, res, next) {
    try {
        const { questionId } = req.params;
        const comments = await questionModel.getCommentsByPostId(questionId);

        res.json({ comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
}

async function createReply(req, res, next) {
    try {
        const { questionId, commentId } = req.params;
        const { username, text } = req.body;
        const reply = await questionModel.createReply(questionId, commentId, username, text);

        res.json({ message: 'Reply added successfully', reply });
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).json({ error: 'Failed to add reply' });
    }
}

module.exports = {
    getAllQuestions,
    createQuestion,
    getPopularTags,
    searchQuestions,
    getQuestionById,
    getDiscussionsByTag,
    createComment,
    getCommentsByPostId,
    createReply
};
