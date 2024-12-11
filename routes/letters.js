const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const Anthropic = require('@anthropic-ai/sdk');

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Fallback response when API limit is reached
const getFallbackResponse = (childName) => {
    return `Ho ho ho! 🎅 Thank you for your wonderful letter, ${childName}! Keep being good! 🎄 Love, Santa ⛄`;
};

const getSantaResponse = async (childName, letterContent) => {
    try {
        const cleanedLetter = letterContent.replace(/\*([^*]*)\*/g, '').trim();
        
        const message = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 100,
            temperature: 0.8,
            system: `You are Santa Claus writing short, cheerful responses to children's letters. 
                    Key requirements:
                    - Keep responses between 2-3 short sentences
                    - Always start with "Ho ho ho!" 
                    - Include 2-3 relevant Christmas/winter emojis (🎅🎄⛄🦌🎁❄️)
                    - Be warm and encouraging
                    - Keep the magic of Christmas
                    - Sign as "Santa" with an emoji`,
            messages: [{
                role: "user",
                content: `Write a very short response to ${childName}'s letter:\n\n${cleanedLetter}`
            }]
        });
        
        let response = message.content[0].text;
        response = response.replace(/\*([^*]*)\*/g, '')
                         .replace(/\(([^)]*)\)/g, '')
                         .replace(/~([^~]*)~/g, '')
                         .trim();
        
        return response;
    } catch (error) {
        console.error('Claude Error:', error);
        return `Ho ho ho! 🎅 Thank you for your wonderful letter, ${childName}! Keep being good! 🎄 Love, Santa ⛄`;
    }
};

router.post('/submit', async (req, res) => {
    try {
        const { childName, letterContent } = req.body;
        
        if (!childName || !letterContent) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                details: 'Both childName and letterContent are required'
            });
        }

        // Get response from Claude
        const santaResponse = await getSantaResponse(childName, letterContent);

        // Save to database
        const query = `
            INSERT INTO letters (child_name, letter_content, santa_response)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
        const values = [childName, letterContent, santaResponse];
        const dbResponse = await pool.query(query, values);

        res.json(dbResponse.rows[0]);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ 
            error: 'Failed to process letter',
            details: 'Santa is having technical difficulties. Please try again later.'
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM letters ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch letters',
            details: error.message
        });
    }
});

module.exports = router; 