const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const axios = require("axios");

app.use(cors());

app.get("/jokes", async (req, res) => {
  try {
    const api_url = "http://api.icndb.com/jokes/random/10";
    const fetch_res = await axios.get(api_url);
    res.send(fetch_res.data);
  } catch (err) {
    res.send(err);
  }
});

app.get("/joke", async (req, res) => {
  try {
    const api_url = "http://api.icndb.com/jokes/random/1";
    const fetch_res = await axios.get(api_url);
    res.send(fetch_res.data);
  } catch (err) {
    res.send(err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
