import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import http from 'http';
import codeBlockRoutes from '../Backend/Routes/CodeBlockRoutes.js';
import cors from 'cors';
import setupSocket from './socket.js';

const app = express(); 

// Allow requests from the frontend
app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
}));
const server = http.createServer(app);
setupSocket(server);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', codeBlockRoutes);

const initApp = () => {
  return new Promise((resolve, reject) => {
    // Connect to MongoDB
    const db = mongoose.connection;

    db.on("error", (err) => {
      console.error(err);
      reject(err);
    });

    db.once("open", () => {
      console.log("Connected to MongoDB");
    });

    mongoose.connect(process.env.DB_CONNECT).then(() => {
      console.log("initApp finish");
      resolve({ app, server });
    });
  });
};

export default initApp;