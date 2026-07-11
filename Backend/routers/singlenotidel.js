import accesscheckmiddleware from "../middlewares/accesscheckmiddleware.js";
import notificationmodel from "../models/notification.js";

import express from "express"
const singlenotidel = express.Router()
singlenotidel.delete("/notifications/:id", accesscheckmiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await notificationmodel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Notification deleted"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
});
export default singlenotidel