import express from 'express';
import cors from 'cors';
import router from "./src/routes/index";
import errorHandler from "./src/middleware/ErrorHandlingMiddleware";
import onConnection from "./src/sockets";
import {Server} from "socket.io";
import {IO} from "./src/types/webRTCtype.ts";

const app = express();
const PORT = process.env.PORT || 5000;

const server = require('http').createServer(app)
const io = new Server<IO>(server, {
  cors: {
    origin: ["*"],
    methods: ["GET", "POST"],
  },
});

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(errorHandler)

console.log("before connection")
io.on('connection', (socket) => {
  onConnection(io, socket)
})

const letsGo = async () => {
  try {
    server.listen(PORT, () => console.log(`localhost:${PORT}`))
  } catch (e) {
    console.log(e)
  }
}


void letsGo()