const mongoose = require('mongoose');
const dotenv = require('dotenv');

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

module.exports = connect;