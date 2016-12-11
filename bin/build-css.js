"use strict";

const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const cssnano = require("cssnano");
const cssnext = require("postcss-cssnext");
const cssimport = require("postcss-import");

// https://github.com/ai/browserslist#custom-usage-data
const browserslist = [
  "> 5% in FR",
  "last 3 versions",
  "ie >= 11",
  "last 2 ie_mob versions"
];
let css = "css";
const src = path.resolve(__dirname, "..", "src/css", "main.css");
const dest = path.resolve(__dirname, "..", "public", "main.css");

fs.readFile(src, (err, css) => {

  if (err) throw err;

  // Setups
  postcss([
    cssimport({ path: src }),
    cssnext({ browsers: browserslist }),
    // cssnano()
  ])
  // Runs
  .process(css, {
    from: src,
    to: dest,
    map: { inline: false }
  })
  // Writes...
  .then(res => {
    fs.writeFileSync(dest, res.css);
    console.log("-> File builded: " + path.basename(dest));
    if ( res.map ) {
      fs.writeFileSync(dest + ".map", res.map);
      console.log("-> File builded: " + path.basename(dest) + ".map");
    }
  })
  .catch(err => console.error(err));
  // https://github.com/postcss/postcss#js-api
  // http://api.postcss.org/postcss.html

});
