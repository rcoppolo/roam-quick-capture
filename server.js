const express = require("express");
const bodyParser = require('body-parser')
const RoamPrivateApi = require("roam-research-private-api");
const puppeteer = require('puppeteer');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 3333;

const roamApi = new RoamPrivateApi(
  process.env.ROAM_GRAPH,
  process.env.ROAM_EMAIL,
  process.env.ROAM_PASSWORD,
  {
    headless: true,
    args: ["--no-sandbox"],
  }
);

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));

app.post(["/roam"], (req, res) => {
  console.log(req.body)

  if (req.body.key !== process.env.ROAM_EXTENSION_KEY) {
    res.send("bad key")
    return
  }

  if (req.body.text) {
    const selectedText = "hi there from somehwere"
    roamApi.logIn()
      .then( () => {
        roamApi.quickCapture( req.body.text )
      })
      .then( result =>roamApi.close() );
    res.send("ok");
  } else {
    res.send("nope");
  }
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`))
