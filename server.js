const express = require("express");
const bodyParser = require('body-parser')
const RoamPrivateApi = require("roam-research-private-api");
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3333;

const roamApi = new RoamPrivateApi(
  process.env.ROAM_GRAPH,
  process.env.ROAM_EMAIL,
  process.env.ROAM_PASSWORD,
  {
    headless: true,
  }
);

app.use(bodyParser.json())
app.use(cors({
    origin: '*'
}));

app.post(["/roam"], (req, res) => {
  if (req.body.key !== process.env.ROAM_EXTENSION_KEY) {
    res.send("bad key")
    return
  }

  if (req.body.text) {
    roamApi.logIn()
      .then( () => roamApi.quickCapture( req.body.text ) )
      .then( result => roamApi.close() );
    res.send("ok");
  } else {
    res.send("nope");
  }
});

app.listen(port, () => console.log(`Roam Quick Capture listening on port ${port}!`))
