'use strict'
import {
  JsonValidationModel,
  PrettifiedJsonModel,
  MinifiedJsonModel,
  XMLModel,
  JsonModel
} from './dto/models.mjs';
import { clipboard } from 'electron';
import { js2xml } from 'xml-js';
import xml2js from 'xml2js';

const _fallbackIndent = 2;

const handlers = [
  {
    _name: 'isValidJson',
    _function: (event, value) => {
      return _isValidJson(value);
    }
  },
  {
    _name: 'prettifyJson',
    _function: (event, value, indent) => {
      return _prettifyJson(value, indent);
    }
  },
  {
    _name: 'minifyJson',
    _function: (event, value) => {
      return _minifyJson(value);
    }
  },
  {
    _name: 'copyToClipboard',
    _function: (event, value) => {
      if (value) clipboard.writeText(value);
    }
  },
  {
    _name: 'convertToXmlFromJson',
    _function: (event, value) => {
      return _convertToXmlFromJson(value);
    }
  },
  {
    _name: 'convertToJsonFromXml',
    _function: (event, value) => {
      return _convertToJsonFromXml(value);
    }
  }
];

function _convertToJsonFromXml(xml) {
  let jsonModel = new JsonModel();
  const xmlParser = new xml2js.Parser({
    explicitArray: false
  });
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      jsonModel.jsonValidity.errorMessage =
        err.message ? err.message.replaceAll("\n", ",") : "";
      return;
    }
    try {
      jsonModel.jsonData = JSON.stringify(result, null, 2);
      jsonModel.jsonValidity.isValid = true;
    } catch (error) {
      jsonModel.jsonValidity.errorMessage = error.message;
    }
  });
  return jsonModel;
}

function _convertToXmlFromJson(json) {
  let xmlModel = new XMLModel();
  let options = {
    compact: true,
    ignoreComment: true,
    fullTagEmptyElement: true,
    spaces: 2
  }
  try {
    let data = JSON.parse(json);
    let xmlString = js2xml(data, options);
    xmlModel.xmlData = xmlString;
    xmlModel.xmlValidity.isValid = true;
  } catch (error) {
    xmlModel.xmlValidity.errorMessage = error.message;
  }
  return xmlModel;
}

function _minifyJson(json) {
  let minifiedJsonModel = new MinifiedJsonModel();
  let jsonValidationModel = _isValidJson(json);
  if (!jsonValidationModel.isValid) {
    minifiedJsonModel.jsonValidity.errorMessage = jsonValidationModel.errorMessage
    return minifiedJsonModel;
  }
  let jsonObject = JSON.parse(json);
  minifiedJsonModel.minifiedJson = JSON.stringify(jsonObject, null, 0);
  minifiedJsonModel.jsonValidity.isValid = true;
  return minifiedJsonModel;
}

function _prettifyJson(json, indent) {
  let prettifiedJsonModel = new PrettifiedJsonModel();
  let jsonValidationModel = _isValidJson(json);
  if (!jsonValidationModel.isValid) {
    prettifiedJsonModel.jsonValidity.errorMessage = jsonValidationModel.errorMessage
    return prettifiedJsonModel;
  }
  if (indent && !isNaN(indent) && (indent < 0 || indent > 8)) {
    prettifiedJsonModel.jsonValidity.errorMessage = 'Indent must be a number between 0 and 8';
    prettifiedJsonModel.isIndentInvalid = true;
    return prettifiedJsonModel;
  }
  if (!indent || isNaN(indent)) {
    indent = _fallbackIndent;
  }
  let jsonObject = JSON.parse(json);
  prettifiedJsonModel.prettifiedJson = JSON.stringify(jsonObject, null, Number.parseInt(indent));
  prettifiedJsonModel.jsonValidity.isValid = true;
  return prettifiedJsonModel;
}

function _isValidJson(json) {
  let jsonValidationModel = new JsonValidationModel();
  if (!json) {
    jsonValidationModel.errorMessage = 'Invalid JSON';
    return jsonValidationModel;
  }
  try {
    JSON.parse(json);
    jsonValidationModel.isValid = true;
  } catch (error) {
    jsonValidationModel.errorMessage = error.message;
  }
  return jsonValidationModel;
}

export default handlers;
