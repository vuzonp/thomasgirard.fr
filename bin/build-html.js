"use strict";

const fs = require("fs");
const path = require("path");
const clc = require('cli-color');
const glob = require("glob");
const Handlebar = require("handlebars");

const data = require("../data.json");
const src = path.resolve(__dirname, "..", "src/hbs");
const dest = path.resolve(__dirname, "..", "public");

/**
 * Converts the templates to html
 * @param {string} file - Path of a *handlebars* template file
 */
function make(file) {
  fs.readFile(file, "utf-8", (err, src) => {
    if (err) { throw err; }

    let template = null;
    let html = "";
    let outfile = path.normalize(
      path.format({
        dir: dest,
        name: path.parse(file)["name"],
        ext: ".html"
      })
    );

    template = Handlebar.compile(src);
    html = template(data);

    fs.writeFile(outfile, html, (err) => {
      if (err) {
        console.error(clc.red("✘", outfile));
        console.error(clc.italic("⮑", err.message));
      } else {
        console.log(clc.green("✔", outfile));
      }
    });

  });
}

/**
 *
 */
function loadPartials(dirname) {
  return new Promise ((resolve, reject) => {
    const pattern = path.resolve(src, dirname) + "/*.hbs";
    glob(pattern, {}, (err, files) => {
      if (err) {
        reject(err);
      }
      // Prepares the partials
      files.forEach(file => {
        const partialContent = fs.readFileSync(file);
        if (partialContent) {
          Handlebar.registerPartial(
            path.parse(file)["name"],
            partialContent.toString()
          );
        }
      });
      resolve();
    });
  });
}

// Compiles the templates
loadPartials("components").then(() => {
  loadPartials("partials").then(() => {
    glob(src + "/*.hbs", {}, (err, files) => {
      if (err) { throw err; }
      files.forEach((file) => {
        make(file);
      });
    });
  }).catch((err) => {
    console.error(clc.red("✘", err));
  });
}).catch((err) => {
  console.error(clc.red("✘", err));
});
