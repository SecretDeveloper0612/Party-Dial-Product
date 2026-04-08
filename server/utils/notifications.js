const axios = require('axios');

async function sendPushNotification(expoPushToken, title, body, data = {}, subtitle = null) {
    if (!expoPushToken) return;

    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        subtitle: subtitle,
        body: body,
        data: data,
        priority: 'high',
        channelId: 'default',
        _displayInForeground: true, // For Expo Go specifically to allow banner when app is open
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
