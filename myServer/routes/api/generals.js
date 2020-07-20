const express = require("express");
const router = express.Router();
const { createWorker } = require("tesseract.js");

// SAVE IMAGE AND OCR
router.post("/ocrimage", async (req, res) => {
  // assign file from request to a constant
  const file = req.files.photo;

  try {
    const worker = createWorker();

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const {
      data: { text },
    } = await worker.recognize(file.data);

    return res.json({
      success: true,
      text,
    });
  } catch (e) {}
});
