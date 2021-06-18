// ES6 import or TypeScript
import { io } from "socket.io-client";
// CommonJS

const socket = io({
    query: {
      x: 42
    }
  });
