import { io } from "socket.io-client";
import { API } from "../config";
const socket = io(API, {
  autoConnect: false, // khud connect mat hona
});

const userid = localStorage.getItem("userid");

if (userid) {
  socket.io.opts.query = {
    userId: userid,
  };

  socket.connect();
}

export default socket;