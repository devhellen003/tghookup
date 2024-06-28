import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const app = express();
app.use(express.json());

// Set up the webhook
const setWebhook = async () => {
    try {
        const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: `${WEBHOOK_URL}${TELEGRAM_BOT_TOKEN}` })
        });
        const data = await response.json();
        console.log('Webhook set:', data);
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
};

// Handle incoming updates
app.post(`/webhook/${TELEGRAM_BOT_TOKEN}`, (req, res) => {
    console.log("Received Message")
    const message = req.body.message;
    if (message) {
        console.log(`Message from ${message.from.username}: ${message.text}`);
    }
    res.sendStatus(200);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await setWebhook();
});
