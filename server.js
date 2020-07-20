const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const fileupload = require("express-fileupload");

nextApp.prepare().then(() => {
  // instantiate express
  const app = express();

  // use middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(fileupload()); // handles file upload

  //General Routes
  app.use("/api/general", require("./myServer/routes/api/generals"));

  // Payment Routes
  // app.post("/jjjjjj", async (req, res) => {});

  // Lets next js handle any other route e.g client-side
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
