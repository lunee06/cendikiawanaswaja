// db.js
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'forumdb'; // Sesuaikan dengan nama database Anda

let db = null;

async function connectDB() {
    if (db) return db;

    try {
        const client = await MongoClient.connect(url, {

        });
        db = client.db(dbName);
        console.log('MongoDB Connected:', url);
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

function getDB() {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB first.');
    }
    return db;
}

module.exports = {
    connectDB,
    getDB
};
