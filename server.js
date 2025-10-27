const express = require("express");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const cors = require("cors");
const mainRouter = require("./src/routes/route.js");
const helmet = require("helmet");
const { errorHandler } = require("./src/middlewares/middleware.js");
const app = express();

require("colors");

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 200,
    message: {
      success: false,
      message: "Too many requests from this IP, please try again later.",
    },
  })
);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(errorHandler);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use("/api", mainRouter);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "System Working fine" });
});

(async () => {
  try {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT}`.bgCyan
          .bgMagenta
      );
    });
  } catch (error) {
    console.error("Internal Server Error:", error.message);
  }
})();
