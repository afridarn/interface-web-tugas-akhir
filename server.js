const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;
const { router } = require("./routes/routes");

//setup view engine using ejs and tailwind
app.set("views", path.join(__dirname, "./views/"));
app.set("view engine", "ejs");
app.use("/public", express.static("public"));

//routes
app.use("/", router);

//listen to port
app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is listening on ${PORT},
    http://localhost:${PORT}`);
});
