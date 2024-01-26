var fs = require("fs");
const { Translate } = require("@google-cloud/translate").v2;

/**
 * TODO(developer): Specify the target language code below
 * This script auto-detects source language
 */
const targetLanguage = "en";

/**
 * TODO(developer): Specify the source and targe JSON file paths
 */
const targetFile = "en.json";
const sourceFile = "cs.json";

const DEBUG = false;

const googleTranslate = new Translate();

translateFile(sourceFile, targetFile, targetLanguage);

async function translateFile(sourceFile, targetFile, targetLanguage) {
  const sourceJSON = JSON.parse(fs.readFileSync(sourceFile, "UTF-8"));
  log(`sourceJSON: ${JSON.stringify(sourceJSON)}`)
  const translatedJSON = await translateJSON(sourceJSON, targetLanguage);
  const translatedText = JSON.stringify(translatedJSON, null, 4);
  log(`translated text: ${translatedText}`);
  fs.writeFileSync(targetFile, translatedText);
}

async function translateJSON(json, targetLanguage) {
  for (const [key, value] of Object.entries(json)) {
    if(typeof value === 'string') {
      log(`found: ${key} == ${value} which is string`);
      json[key] = await translateString(value, targetLanguage);
    } else {
      log(`found: ${key} which is object`);
      json[key] = await translateJSON(value, targetLanguage);
    }
  };
  return json;
}

async function translateString(string, targetLanguage) {
  const translationData = await googleTranslate.translate(string, targetLanguage);
  const translation = translationData[0];
  log(`translated "${string}" as "${translation}"`);
  return translation;
}

function log(string) {
  if(DEBUG === true) {
    console.log(string);
  }
}