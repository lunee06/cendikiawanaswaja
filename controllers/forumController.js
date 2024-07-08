const { ObjectId } = require('mongodb');
const getDB = require('../db').getDB;
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
    const { sort, page = 1, perPage = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(perPage);
    const limit = parseInt(perPage);

    try {
        const db = getDB();
        let sortOptions = { createdAt: -1 };

        if (sort === 'oldest') {
            sortOptions = { createdAt: 1 };
        }

        const totalQuestions = await db.collection('questions').countDocuments();
        const totalPages = Math.ceil(totalQuestions / perPage);

        const questions = await db.collection('questions')
            .find()
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .toArray();

        const formattedQuestions = questions.map(question => ({
            ...question,
            formattedCreatedAt: formatTimestamp(question.createdAt)
        }));

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
    const tagsArray = tags.split(' ').filter(tag => tag.trim() !== '');
    let imageUrl;

    if (req.file) {
        imageUrl = req.file.path;
    }

    try {
        const db = getDB();
        const result = await db.collection('questions').insertOne({ 
            title, 
            description, 
            tags: tagsArray, 
            imageUrl,
            createdAt: new Date() 
        });
        
        if (result.insertedId) {
            const createdAt = new Date();
            const question = { 
                _id: result.insertedId, 
                title, 
                description, 
                tags: tagsArray, 
                imageUrl, 
                createdAt 
            };
            const formattedQuestion = {
                ...question,
                formattedCreatedAt: formatTimestamp(question.createdAt)
            };
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
        const db = getDB();
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
            link: `/tags/${encodeURIComponent(tag._id)}`
        }));

        res.json({ message: "Successfully fetched popular tags", tags: popularTags });
    } catch (error) {
        console.error('Error fetching popular tags from MongoDB:', error);
        res.status(500).json({ error: "Failed to fetch popular tags" });
    }
}

async function getDiscussionsByTag(req, res, next) {
    const { tagName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    try {
        const db = getDB();
        const skip = (page - 1) * pageSize;
        
        const countQuery = await db.collection('questions').find({ tags: tagName }).count();
        
        const discussions = await db.collection('questions')
            .find({ tags: tagName })
            .skip(skip)
            .limit(pageSize)
            .toArray();

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
        const db = getDB();
        const regex = new RegExp(keyword, 'i');

        const results = await db.collection('questions').find({
            $or: [
                { title: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        }).toArray();

        const formattedResults = results.map(question => ({
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
    const { id } = req.params;
    try {
        const db = getDB();
        const question = await db.collection('questions').findOne({ _id: new ObjectId(id) });
        
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
    const { questionId } = req.params;
    const { username, text, parentId } = req.body;

    const db = getDB();
    const comment = { _id: new ObjectId(), username, text, createdAt: new Date() };

    try {
        if (parentId) {
            const result = await db.collection('questions').updateOne(
                { _id: new ObjectId(questionId), "comments._id": new ObjectId(parentId) },
                { $push: { "comments.$.replies": comment } }
            );

            if (result.modifiedCount > 0) {
                res.json({ message: 'Reply added successfully', comment });
            } else {
                throw new Error('Failed to add reply to comment');
            }
        } else {
            const result = await db.collection('questions').updateOne(
                { _id: new ObjectId(questionId) },
                { $push: { comments: comment } }
            );

            if (result.modifiedCount > 0) {
                res.json({ message: 'Comment added successfully', comment });
            } else {
                throw new Error('Failed to add comment to question');
            }
        }
    } catch (error) {
        console.error('Error adding comment or reply:', error);
        res.status(500).json({ error: 'Failed to add comment or reply' });
    }
}

async function getCommentsByPostId(req, res, next) {
    const { questionId } = req.params;

    try {
        const db = getDB();
        const question = await db.collection('questions').findOne({ _id: new ObjectId(questionId) });

        if (question) {
            const comments = question.comments.map(comment => ({
                ...comment,
                formattedCreatedAt: formatTimestamp(comment.createdAt),
                replies: comment.replies ? comment.replies.map(reply => ({
                    ...reply,
                    formattedCreatedAt: formatTimestamp(reply.createdAt)
                })) : []
            }));

            res.json({ comments });
        } else {
            res.status(404).json({ error: 'Question not found' });
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
}

async function createReply(req, res, next) {
    const { questionId, commentId } = req.params;
    const { username, text } = req.body;
    const reply = { username, text, createdAt: new Date() };

    try {
        const db = getDB();
        const result = await db.collection('questions').updateOne(
            { 
                _id: new ObjectId(questionId), 
                'comments._id': new ObjectId(commentId) 
            },
            { 
                $push: { 'comments.$.replies': reply } 
            }
        );

        if (result.modifiedCount > 0) {
            const formattedReply = {
                ...reply,
                formattedCreatedAt: formatTimestamp(reply.createdAt)
            };
            res.json({ message: 'Reply added successfully', reply: formattedReply });
        } else {
            res.status(404).json({ error: 'Comment not found' });
        }
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
