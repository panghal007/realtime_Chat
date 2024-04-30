//mongodb+srv://panghalunique:78MfYyFCRtmolv7T@cluster0.ovkcvpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_here',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://panghalunique:78MfYyFCRtmolv7T@cluster0.ovkcvpn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
};