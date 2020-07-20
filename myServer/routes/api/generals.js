const express = require("express");
const router = express.Router();
const { createWorker } = require("tesseract.js");

// Load Image and OCR
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
  } catch (e) {
    // console.log(e)
  }
});

// // Load Image and send back to client
// router.post("/image", async (req, res) => {
//   // assign file from request to a constant
//   const file = req.files.photo;

//   const data = file.data;
//   const mimetype = file.mimetype;

//   try {
//     return res.json({
//       success: true,
//       message: "image upload successful",
//       data,
//       contentType: mimetype,
//     });
//   } catch (e) {
//     // console.log(e)
//   }
// });

module.exports = router;
