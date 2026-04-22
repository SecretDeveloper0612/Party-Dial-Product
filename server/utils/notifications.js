const axios = require('axios');

async function sendPushNotification(expoPushToken, title, body, data = {}, subtitle = null) {
    if (!expoPushToken) return;

    const message = {
        to: expoPushToken,
        sound: 'lead_alert',       // custom sound (without extension for FCM)
        title: title,
        subtitle: subtitle,
        body: body,
        data: data,
        priority: 'high',
        channelId: 'leads',        // must match the channel registered in the app
    };

    try {
        const response = await axios.post('https://exp.host/--/api/v2/push/send', message, {
            headers: {
                'Accept': 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
        });
        console.log('Push notification sent:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending push notification:', error.message);
        return null;
    }
}

module.exports = { sendPushNotification };
