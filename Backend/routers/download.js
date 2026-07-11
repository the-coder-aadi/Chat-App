import express from "express"
const downloadrouter = express.Router()
downloadrouter.get("/download", async (req, res) => {
  try {
    const imageUrl = req.query.url;

    if (!imageUrl) {
      return res.status(400).json({
        message: "Image url missing"
      });
    }

    const response = await fetch(imageUrl);

    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=image.jpg"
    );

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type")
    );

    res.send(buffer);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Download failed"
    });
  }
});
export default downloadrouter