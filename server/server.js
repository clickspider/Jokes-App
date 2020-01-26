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

app.get("/login/:userAndPass", async (req, res) => {
  try {
    const userAndPass = req.params.userAndPass.split(",");
    const username = userAndPass[0];
    const password = userAndPass[1];
    const api_url = "http://localhost:4000/login";
    const fetch_res = await axios.post(api_url, {
      username,
      password
    });
    res.send(fetch_res.data);
  } catch (err) {
    return res.status(err.response.status).json({
      err: err.response.data.err
    });
  }
});

app.get("/profile/:token", async (req, res) => {
  try {
    const TOKEN = req.params.token;
    const api_url = "http://localhost:4000/api/v1/users/myprofile";
    const fetch_res = await axios.get(api_url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      key: "value"
    });
    res.send(fetch_res.data);
  } catch (err) {
    return res.status(err.response.status).json({
      err: err.response.data.err
    });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
