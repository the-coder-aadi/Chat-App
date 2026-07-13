import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import signuprouter from "./routers/signup.js"
import errorhandle from "./middlewares/errorhandling.js"
import connectdb from "./db.js"
import loginrouter from "./routers/login.js"
import cookieParser from "cookie-parser"
import accesscheck from "./routers/Accesscheck.js"
import refreshcheck from "./routers/Refreshcheck.js"
import getallusers from "./routers/getallusers.js"
import logoutrouter from "./routers/logout.js"
import Message from "./models/Message.js"
import fetchmsgs from "./routers/fetchmsgs.js"
import Onlineusers from "./routers/onlineusers.js"
import redis from "./redis.js"
import notificationmodel from "./models/notification.js"
import router from "./routers/getnotifi.js"
import usermodel from "./models/usermodel.js"
import delnotirouter from "./routers/delnotifications.js"
import singlenotidel from "./routers/singlenotidel.js"
import readnoti from "./routers/readnoti.js"
import getfiles from "./routers/getfiles.js"
import downloadrouter from "./routers/download.js"
import revnoti from "./routers/revnoti.js"
import passport from "passport"
import "./config/passport.js"
import authrouter from "./routers/oauth.js"
import { Server } from "socket.io"
import http from "http"
const App = express()
const server = http.createServer(App)
App.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    },
    credentials: true
})

global.io = io;

App.use(express.json())
App.use(cookieParser())
App.use(passport.initialize())
connectdb()
App.use("/", signuprouter)
App.use("/", loginrouter)
App.use("/", accesscheck)
App.use("/", refreshcheck)
App.use("/", getallusers)
App.use("/", logoutrouter)
App.use("/", fetchmsgs)
App.use("/", Onlineusers)
App.use("/", router)
App.use("/", delnotirouter)
App.use("/", singlenotidel)
App.use("/", readnoti)
App.use("/", getfiles)
App.use("/", downloadrouter)
App.use("/", revnoti)
App.use("/",authrouter)

const onlineUsers = {}
global.onlineUsers = onlineUsers;


io.on("connection", async(socket) => {
  
    console.log("connect on:", socket.id);
    const userid = socket.handshake.query.userId
    onlineUsers[userid] = socket.id
    console.log(onlineUsers);

  await redis.set(`online:${userid}`, socket.id,  
    {
    EX: 60
  }
)

  const currentUser = await usermodel.findById(userid)

const alreadyWelcomed = await notificationmodel.findOne({
    receiverId: userid,
    type: "welcome"
})

if (!alreadyWelcomed) {
    await notificationmodel.create({
        receiverId: userid,
        senderId: userid,
        type: "welcome",
        text: `Welcome to ChatCat ${currentUser.name}`
    })
}

const allUsers = await usermodel.find({
    _id: { $ne: userid }
})

for (const user of allUsers) {
    const alreadyOnline = await notificationmodel.findOne({
        receiverId: user._id,
        senderId: userid,
        type: "online"
    })

    if (!alreadyOnline) {
        await notificationmodel.create({
            receiverId: user._id,
            senderId: userid,
            type: "online",
            text: `${currentUser.name} is online`
        })
    }
}

socket.on("send-message", async(data) => {
    await Message.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        message: data.message,
        replyTo: data.replyTo || null
    })

    const sender = await usermodel.findById(data.senderId)

    const oldNotification = await notificationmodel.findOne({
    receiverId: data.receiverId,
    senderId: data.senderId,
    type: "message"
});

 if (!oldNotification) {

    await notificationmodel.create({
        receiverId: data.receiverId,
        senderId: data.senderId,
        type: "message",
        text: `${sender.name} sent you a message`
    });

} else {

    oldNotification.count += 1;

    oldNotification.text =
        `${sender.name} sent you ${oldNotification.count} messages`;

    await oldNotification.save();

}

    const receiverSocketId = onlineUsers[data.receiverId]

    if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", data)
    }
})

    socket.on("typing", (data) => {
  const receiverSocketId = onlineUsers[data.receiverId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("user-typing", {
      senderId: data.senderId
    });
  }
});

socket.on("heartbeat", async ({ userId }) => {

  await redis.set(
    `online:${userId}`,
    socket.id,
    {
      EX: 60
    }
  );

});

socket.on("send-reaction", async ({ msgId, emoji, receiverId }) => {
  try {
    const msg = await Message.findById(msgId);

    let updatedReactions = [];

    if (msg.reactions?.[0] === emoji) {
      // same emoji -> remove
      updatedReactions = [];
    } else {
      // new emoji -> replace
      updatedReactions = [emoji];
    }

    const updatedMsg = await Message.findByIdAndUpdate(
      msgId,
      {
        reactions: updatedReactions
      },
      { new: true }
    );

    const receiverSocketId = onlineUsers[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-reaction", {
        msgId,
        reactions: updatedMsg.reactions
      });
    }

  } catch (error) {
    console.log(error);
  }
});
socket.on("mark-seen",async(data)=>{
await Message.updateMany(
      {
      senderId: data.senderId,
      receiverId: data.receiverId,
      seen: false
    },
    {
        seen:true
    }
)
const senderSocketId = onlineUsers[data.senderId];

if (senderSocketId) {
  io.to(senderSocketId).emit("msg-seen", {
    by: data.receiverId
  });
}
})



socket.on("edit-message", async (data) => {
  await Message.findByIdAndUpdate(
    data.msgId,
    {
      message: data.newText,
      edited: true
    }
  );

  const receiverSocketId = onlineUsers[data.receiverId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("message-edited", {
      msgId: data.msgId,
      newText: data.newText
    });
  }
});

socket.on("delete-message", async ({ msgId, receiverId }) => {
  try {
    await Message.findByIdAndDelete(msgId);

    const receiverSocketId = onlineUsers[receiverId];

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("message-deleted", {
        msgId
      });
    }
  } catch (error) {
    console.log(error);
  }
});

socket.on("stop-typing", (data) => {
  const receiverSocketId = onlineUsers[data.receiverId];

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("user-stop-typing", {
      senderId: data.senderId
    });
  }
});

socket.on("disconnect", async () => {
  if (onlineUsers[userid] === socket.id) {
    delete onlineUsers[userid]
    await redis.del(`online:${userid}`)
  }

  await notificationmodel.deleteMany({
    senderId: userid,
    type: "online"
  })

  await notificationmodel.deleteOne({
    receiverId: userid,
    type: "welcome"
  })
})
})

App.use(errorhandle)
server.listen(process.env.PORT, () => {
    console.log("server run on port num 7000");
})