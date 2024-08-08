import dotenv from 'dotenv';
dotenv.config({
    path: './.env'
});

import connectDB from './db/db.index.js';
import { app } from './app.js';


const PORT = process.env.PORT;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`⚙️ Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });
