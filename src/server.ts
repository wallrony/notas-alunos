import express from 'express';
import cors from 'cors';
import apiRouter from './routers/ApiRouter';

const server = express();

server.use(express.json());
server.use(cors());
server.use('/api', apiRouter);

export default server;