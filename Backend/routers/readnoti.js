import express from "express"
import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js";
import notificationmodel from "../models/notification.js";
const readnoti = express.Router()
readnoti.patch("/notifications/mark-all-read", accesscheckmiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await notificationmodel.updateMany(
      {
        receiverId: userId,
        read: false
      },
      {
        read: true
      }
    );

    res.json({
      success: true,
      message: "All notifications marked as read"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
});
export default readnoti