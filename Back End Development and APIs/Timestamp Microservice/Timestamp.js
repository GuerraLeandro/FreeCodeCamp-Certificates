const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/api/:date?", (req, res) => {
  let date = req.params.date;
  let response = {};

  if (!date) {
    date = new Date();
  }

  const unixTimestamp = parseInt(date);
  if (unixTimestamp) {
    const utcDate = new Date(unixTimestamp);
    response.unix = unixTimestamp;
    response.utc = utcDate.toUTCString();
  } else {
    const validDate = new Date(date);
    if (validDate.toString() === "Invalid Date") {
      response.error = "Invalid Date";
    } else {
      response.unix = validDate.getTime();
      response.utc = validDate.toUTCString();
    }
  }

  res.json(response);
});

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
