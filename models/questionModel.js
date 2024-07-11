const { ObjectId } = require('mongodb');
const getDB = require('../db').getDB;

async function getAllQuestions(sort = '-createdAt', page = 1, perPage = 10) {
    const db = getDB();
    const skip = (parseInt(page) - 1) * parseInt(perPage);
    const limit = parseInt(perPage);

    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
        sortOptions = { createdAt: 1 };
    }

    const questions = await db.collection('questions')
        .find()
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray();

    return questions;
}

function getTotalPages(perPage) {
    const db = getDB();
    return db.collection('questions').countDocuments().then(totalQuestions => Math.ceil(totalQuestions / perPage));
}

async function createQuestion(title, description, tags, imageUrl) {
    const db = getDB();
    const tagsArray = tags.split(' ').filter(tag => tag.trim() !== '');

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
        return question;
    } else {
        throw new Error('Failed to insert question');
    }
}

async function getPopularTags() {
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

    return popularTags;
}

async function getDiscussionsByTag(tagName, page = 1, pageSize = 10) {
    const db = getDB();
    const skip = (page - 1) * pageSize;

    const discussions = await db.collection('questions')
        .find({ tags: tagName })
        .skip(skip)
        .limit(pageSize)
        .toArray();

    return discussions;
}

function getTotalTagPages(tagName, pageSize) {
    const db = getDB();
    return db.collection('questions').find({ tags: tagName }).count().then(countQuery => Math.ceil(countQuery / pageSize));
}

async function searchQuestions(keyword) {
    const db = getDB();
    const regex = new RegExp(keyword, 'i');

    const results = await db.collection('questions').find({
        $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } }
        ]
    }).toArray();

    return results;
}

async function getQuestionById(id) {
    const db = getDB();
    const question = await db.collection('questions').findOne({ _id: new ObjectId(id) });
    return question;
}

async function createComment(questionId, username, text, parentId) {
    const db = getDB();
    const comment = {
        _id: new ObjectId(),
        username: username || 'Anonymous', // Jika username kosong, gunakan 'Anonymous' sebagai nilai default
        text: text || '', // Jika text kosong, gunakan string kosong sebagai nilai default
        createdAt: new Date()
    };

    if (parentId) {
        const result = await db.collection('questions').updateOne(
            { _id: new ObjectId(questionId), "comments._id": new ObjectId(parentId) },
            { $push: { "comments.$.replies": comment } }
        );

        if (result.modifiedCount > 0) {
            return comment;
        } else {
            throw new Error('Failed to add reply to comment');
        }
    } else {
        const result = await db.collection('questions').updateOne(
            { _id: new ObjectId(questionId) },
            { $push: { comments: comment } }
        );

        if (result.modifiedCount > 0) {
            return comment;
        } else {
            throw new Error('Failed to add comment to question');
        }
    }
}


async function getCommentsByPostId(questionId) {
    const db = getDB();
    const question = await db.collection('questions').findOne({ _id: new ObjectId(questionId) });

    if (question) {
        return question.comments;
    } else {
        throw new Error('Question not found');
    }
}

async function createReply(questionId, commentId, username, text) {
    const db = getDB();
    const reply = { username, text, createdAt: new Date() };

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
        return reply;
    } else {
        throw new Error('Failed to add reply');
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
    createReply,
    getTotalPages,
    getTotalTagPages
};
