/**
 * TODO(developer): Specify the target language code below
 * This script auto-detects source language
 */
var target = "ar"; //Arabic

/**
 * TODO(developer): Specify the source and targe JSON file paths
 */
var targetJSON = "test-ar.json";
var sourceJSON = "test-en.json";

var fs = require("fs");

// Imports the Google Cloud client library
const { Translate } = require("@google-cloud/translate").v2;

// Creates a client
const translate = new Translate();

var desktopEN = JSON.parse(fs.readFileSync(sourceJSON, "UTF-8"));
console.log(desktopEN);
var desktopTranslated = {};

translateText();

async function translateText() {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  for (var key in desktopEN) {
    let [translations] = await translate.translate(desktopEN[key], target);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log("Translations:");
    translations.forEach((translation, i) => {
      desktopTranslated[key] = translation.replace(/"/g, "'");
      console.log(`${desktopEN[key]} => (${target}) ${translation}`);
    });
  }
  console.log(desktopTranslated);
  writeJSONToFile(desktopTranslated);
}

function writeJSONToFile(jsonObj) {
  // convert JSON object to string
  const data = JSON.stringify(jsonObj, null, 4);

  // write JSON string to a file
  fs.writeFile(targetJSON, data, (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}
