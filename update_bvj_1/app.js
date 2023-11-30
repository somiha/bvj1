const express = require("express");
const cookieParser = require("cookie-parser");
const expressWinston = require("express-winston");
const app = express();
const dotenv = require("dotenv");
const Router = require("./src/routers/allRouters");
const cors = require("cors");
const { format, transports } = require("winston");
const insertAndGetID = require("./src/helper/getInsertID");
dotenv.config();

//Set Up Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up cookie parser
app.use(cookieParser());
app.use(
  expressWinston.logger({
    transports: [
      new transports.File({ filename: "logs/error.log", level: "error" }),
    ],
    format: format.combine(
      format.json(),
      format.timestamp(),
      format.prettyPrint()
    ),
  })
);

// static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/images", express.static(__dirname + "public/images"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/icons", express.static(__dirname + "public/icons"));
app.use("/uploads", express.static(__dirname + "public/uploads"));

app.use("/test1", async (req, res) => {
  console.log(await insertAndGetID("INSERT INTO fake(a,b,c) VALUES(1, 2, 3)"));
  res.send("DOne");
});

app.use(cors());
// Templating Engine
app.set("views", "./src/views");
app.set("view engine", "ejs");

// Routes
app.use(Router);

const PORT = process.env.PORT || 5040;
app.listen(PORT, () => {
  console.log(`Success! visit: http://localhost:${PORT}`);
});
