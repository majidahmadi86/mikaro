const fs = require("fs");
const path = require("path");
const root = __dirname;
const top = fs.readFileSync(path.join(root, "index-top.html"), "utf8");
const tail = fs.readFileSync(path.join(root, "index-tail.html"), "utf8");
let port = fs.readFileSync(path.join(root, "assets/html/_portfolio.txt"), "utf8");
port = port
  .replace('id="design"', 'id="portfolio"')
  .replace(
    "Professional design samples across industries — from luxury brands to tech startups, restaurants to education platforms.",
    "Professional design samples across industries."
  );
fs.writeFileSync(path.join(root, "index.html"), top + "\n" + port + "\n" + tail);
console.log("Built index.html");
