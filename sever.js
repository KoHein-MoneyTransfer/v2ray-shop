// server.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/submit-order', async (req, res) => {
    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return res.status(500).json({ success: false, message: 'Server configuration error.' });
    }

    const orderData = req.body;
    let message = `
*V2Ray Order (From Secure Server)* 🚀
--------------------------------------
*User အမျိုးအစား:* ${orderData.userType}
*Package:* ${orderData.plan}
*သုံးစွဲသူအမည်:* ${orderData.userName}
*ဆက်သွယ်ရန်ဖုန်း:* ${orderData.contactPhone}
*ငွေပေးချေမှု:* ${orderData.paymentMethod}
*ငွေလွှဲသူအမည်:* ${orderData.senderName}
*လုပ်ငန်းစဉ်ID (၆)လုံး:* ${orderData.txnId}
*မှတ်ချက်:* ${orderData.note}
`;

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        res.status(200).json({ success: true, message: 'Order submitted successfully!' });
    } catch (error) {
        console.error("Error sending to Telegram:", error.message);
        res.status(500).json({ success: false, message: 'Failed to submit order.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
