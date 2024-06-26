import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './src/routes/index';
import errorHandler from './src/middlewares/error-handling.middleware';
import onConnection from './src/sockets';
import { Server } from 'socket.io';
import { IO } from './src/types/webRTC.type';
import dotenv from 'dotenv';
import http from 'http';
import getAppDataSource from './src/data-source';

dotenv.config();

const { CLIENT_URL, CLIENT_URL_LOCAL, NODE_ENV } = process.env;

console.log("NODE_ENV:", NODE_ENV);

const allowedOrigin = [CLIENT_URL, CLIENT_URL_LOCAL];

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5555;
const io = new Server<IO>(server, {
  cors: {
    origin: allowedOrigin,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: allowedOrigin }));
app.use('/api', router);

// Error handler should be last
app.use(errorHandler);

io.on('connection', (socket) => {
  onConnection(io, socket);
});

const letsGo = async () => {
  try {
    await getAppDataSource();
    server.listen(PORT, () => console.log(`localhost:${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

void letsGo();
