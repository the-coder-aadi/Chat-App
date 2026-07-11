import express from "express";
import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js";
import notificationmodel from "../models/notification.js";

const revnoti = express.Router();

revnoti.delete(
  "/read-notification",
  accesscheckmiddleware,
  async (req, res) => {
    try {

      const userId = req.user.id;

      await notificationmodel.deleteMany({
        receiverId: userId,
        type: "message"
      });

      res.json({
        success: true,
        message: "Message notifications deleted"
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false
      });

    }
  }
);

export default revnoti;