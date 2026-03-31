// Return public Appwrite configuration for the frontend
exports.getPublicConfig = (req, res) => {
    res.status(200).json({
        status: 'success',
        endpoint: process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1',
        projectId: process.env.APPWRITE_PROJECT_ID || '69ae84bc001ca4edf8c2'
    });
};
