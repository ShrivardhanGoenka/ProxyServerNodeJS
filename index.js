const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT =  process.env.PORT || 3001;
const SERVER_URL =
  "https://1agnfox1re.execute-api.ap-south-1.amazonaws.com/Production";

app.use(express.json()); // bodyParser.json() is deprecated
app.use(cors());

app.all("*", async (req, res) => {
  try {
    const url = SERVER_URL + req.originalUrl;
    console.log(`Proxying request to: ${url}`);
    let options = {};

    let headers = {
      "x-api-key": req.headers["x-api-key"],
      "Content-Type": req.headers["Content-Type"],
    };

    if (req.method == "POST") {
      let requestjson = {};
      try {
        requestjson = await req.body;
      } catch (e) {}
      options = {
        uri: url,
        method: req.method,
        headers: headers,
        body: JSON.stringify(requestjson),
      };
    } else {
      options = {
        uri: url,
        method: req.method,
        headers: headers,
      };
    }
    let r = await fetch(url, options);
    console.log(r.status);
    let responsejson = await r.json();
    if (typeof responsejson == "string") {
      responsejson = { error: responsejson };
    }
    console.log(responsejson);
    res.status(r.status).send(responsejson);
  } catch (e) {
    console.log(e);
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});