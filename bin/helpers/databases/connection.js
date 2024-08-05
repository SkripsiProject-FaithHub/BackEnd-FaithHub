const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cloudinary = require("cloudinary").v2;

dotenv.config();

const { DB_URL, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;

async function connect() {
    try {
        await mongoose.connect(`${DB_URL}/${DB_DATABASE}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auth: {
                username: DB_USERNAME || "",
                password: DB_PASSWORD || ""
            }
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit with error
    }
}

async function connectCloudinary() {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        });
        console.log('Connected to Cloudinary');
    } catch (error) {
        console.error('Failed to connect to Cloudinary:', error);
        process.exit(1); // Exit with error
    }
}

module.exports = {connect , connectCloudinary};