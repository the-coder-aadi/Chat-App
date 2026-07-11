import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js";
import notificationmodel from "../models/notification.js";
import express from "express"
const delnotirouter = express.Router()
delnotirouter.delete("/notifications/clear-all", accesscheckmiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await notificationmodel.deleteMany({
      receiverId: userId
    });

    res.json({
      success: true,
      message: "All notifications cleared"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
});
export default delnotirouter