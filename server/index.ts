import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from "./src/routes/index";
import errorHandler from "./src/middlewares/error-handling.middleware";
import onConnection from "./src/sockets";
import {Server} from "socket.io";
import {IO} from "./src/types/webRTC.type";
import dotenv from "dotenv";
import { AppDataSource } from "./src/data-source";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const server = require('http').createServer(app)
const io = new Server<IO>(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
});

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use('/api', router)

// Error handler should be last
app.use(errorHandler)

io.on('connection', (socket) => {
  onConnection(io, socket)
})

const letsGo = async () => {
  try {
    await AppDataSource.initialize();
    server.listen(PORT, () => console.log(`localhost:${PORT}`))
  } catch (e) {
    console.log(e)
  }
}


void letsGo()