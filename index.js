const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const request = require('request');

const app = express();
const PORT =  process.env.PORT || 3001;
const SERVER_URL_AWS =
  "https://1agnfox1re.execute-api.ap-south-1.amazonaws.com/Production/";
const SERVER_URL_DJANGO =
  "https://shrivardhangoenka.com/";

app.use(express.json()); // bodyParser.json() is deprecated
app.use(cors());

app.all("/awslambda/*", async (req, res) => {
  proxy(SERVER_URL_AWS, req, res)
})

app.all("/djangoserver/*", async (req, res) => {
  proxy(SERVER_URL_DJANGO, req, res)
})

function proxy(serverUrl, req, res) {
  try {
    const url = serverUrl + req.params[0];
    console.log(`Proxying request to: ${url}`);
    let options = {};

    let headers = {
      "x-api-key": req.headers["x-api-key"],
      "Content-Type": req.headers["Content-Type"],
    };

    if (req.method == "POST") {
      options = {
        uri: url,
        method: req.method,
        headers: headers,
        body: JSON.stringify(req.body),
      };
    } else {
      options = {
        uri: url,
        method: req.method,
        headers: headers,
      };
    }

    request(options).pipe(res);
  } catch (e) {
    console.log(e);
  }
};

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
