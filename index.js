const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const { userRouter } = require("./routes/credential.routes");

app.use("/api", userRouter);
app.get("/", (req, res) => {
  res.status(200).send("Welcome..... Successfully connected to the server");
});

app.listen(process.env.PORT || 80, async () => {
  console.log(`server running at ${process.env.PORT || 80} \n`);
});
