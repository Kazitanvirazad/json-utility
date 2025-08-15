'use strict'

import {
  JsonValidationModel,
  PrettifiedJsonModel,
  MinifiedJsonModel,
  XMLModel,
  JsonModel,
  FlatUnflatJsonModel,
  GenericErrorModel
} from './dto/models.mjs';
import { clipboard } from 'electron';
import { js2xml } from 'xml-js';
import xml2js from 'xml2js';
import { flatten, unflatten } from 'flat';

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
  },
  {
    _name: 'createPropertyFromJson',
    _function: (event, value) => {
      return _createPropertyFromJson(value);
    }
  },
  {
    _name: 'createJsonFromProperty',
    _function: (event, value) => {
      return _createJsonFromProperty(value);
    }
  }
]

function _convertToJsonFromXml(xml) {
  let jsonModel = new JsonModel();
  const xmlParser = new xml2js.Parser({
    explicitArray: false
  });
  xmlParser.parseString(xml, (err, result) => {
    if (err) {
      jsonModel.jsonValidity.errorMessage = err.message ? err.message.replaceAll('\n', ',') : '';
      return;
    }
    try {
      jsonModel.jsonData = JSON.stringify(result, null, 2);
      jsonModel.jsonValidity.isValid = true;
    } catch (error) {
      jsonModel.jsonValidity.errorMessage = error.message;
    }
  })
  return jsonModel;
}

function _convertToXmlFromJson(json) {
  let xmlModel = new XMLModel();
  let options = {
    compact: true,
    ignoreComment: true,
    fullTagEmptyElement: true,
    spaces: 2
  };
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
    minifiedJsonModel.jsonValidity.errorMessage = jsonValidationModel.errorMessage;
    return minifiedJsonModel;
  }
  let jsonObject = jsonValidationModel.jsonData;
  minifiedJsonModel.minifiedJson = JSON.stringify(jsonObject, null, 0);
  minifiedJsonModel.jsonValidity.isValid = true;
  return minifiedJsonModel;
}

function _prettifyJson(json, indent) {
  let prettifiedJsonModel = new PrettifiedJsonModel();
  let jsonValidationModel = _isValidJson(json);
  if (!jsonValidationModel.isValid) {
    prettifiedJsonModel.jsonValidity.errorMessage = jsonValidationModel.errorMessage;
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
  let jsonObject = jsonValidationModel.jsonData;
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
    jsonValidationModel.jsonData = JSON.parse(json);
    jsonValidationModel.isValid = true;
  } catch (error) {
    jsonValidationModel.errorMessage = error.message;
  }
  return jsonValidationModel;
}

function _createPropertyFromJson(json) {
  let flatUnflatJsonModel = flatJsonInPropertyFormat(json);
  if (flatUnflatJsonModel.error) {
    return flatUnflatJsonModel;
  }
  createPropertyTextFromFlattenedJsonObject(flatUnflatJsonModel);
  return flatUnflatJsonModel;
}

function _createJsonFromProperty(propertyText) {
  let flatUnflatJsonModel = convertPropertyToFlatJsonObject(propertyText);
  if (flatUnflatJsonModel.error) {
    return flatUnflatJsonModel;
  }
  unflattenJsonFromFlatJsonObject(flatUnflatJsonModel);
  return flatUnflatJsonModel;
}

function unflattenJsonFromFlatJsonObject(flatUnflatJsonModel) {
  let flattenedJsonObject =
    flatUnflatJsonModel && flatUnflatJsonModel.flattenedJsonObject
      ? flatUnflatJsonModel.flattenedJsonObject
      : {};
  let unflattenOptions = { delimiter: '.', object: false };
  try {
    let unflattenedJsonObject = unflatten(flattenedJsonObject, unflattenOptions);
    flatUnflatJsonModel.unflattenedJsonString = JSON.stringify(unflattenedJsonObject, null, 2);
  } catch (error) {
    flatUnflatJsonModel.error = true;
    flatUnflatJsonModel.errorMessage = error.message;
  }
}

function convertPropertyToFlatJsonObject(propertyText) {
  let flatUnflatJsonModel = new FlatUnflatJsonModel();
  let validatedProperty = validatePropertyText(propertyText);
  if (validatedProperty.error) {
    flatUnflatJsonModel.error = true;
    flatUnflatJsonModel.errorMessage = validatedProperty.errorMessage;
    return flatUnflatJsonModel;
  }
  let flatJsonObjectList = propertyText
    .split(/\r\n|\r|\n/)
    .filter((propertyLine) => {
      let line = propertyLine.trim();
      return (
        line &&
        line.trim().length > 0 &&
        line.trim() != 'null' &&
        line.trim() != 'undefined' &&
        line.trim() != 'false' &&
        line.trim() != '0'
      );
    })
    .map((propertyLine) => {
      const indexOfFirstEquals = propertyLine.indexOf('=');
      const key = propertyLine.substring(0, indexOfFirstEquals);
      const value = propertyLine.substring(indexOfFirstEquals + 1);
      if (key === null) {
        return null;
      }
      let res = {};
      res[key.trim()] = getNativeType(value);
      return res;
    })
    .filter((flatObject) => flatObject != null);

  let flatJsonObject = {};
  flatJsonObjectList.forEach((obj) => Object.assign(flatJsonObject, obj));
  flatUnflatJsonModel.flattenedJsonObject = flatJsonObject;
  return flatUnflatJsonModel;
}

function createPropertyTextFromFlattenedJsonObject(flatUnflatJsonModel) {
  let property = '';
  let flattenedJsonObject =
    flatUnflatJsonModel && flatUnflatJsonModel.flattenedJsonObject
      ? flatUnflatJsonModel.flattenedJsonObject
      : {};
  Object.keys(flattenedJsonObject).forEach((key) => {
    if (key && key.length > 0) {
      let value = '';
      if (flattenedJsonObject[key] != null) {
        switch (typeof flattenedJsonObject[key]) {
          case 'number' || 'boolean':
            value = String(flattenedJsonObject[key]);
            break;
          default:
            value = flattenedJsonObject[key];
            break;
        }
      }
      property += `${key}=${value}\n`;
    }
  })
  flatUnflatJsonModel.propertyText = property;
}

function flatJsonInPropertyFormat(json) {
  let flatUnflatJsonModel = new FlatUnflatJsonModel();
  let jsonValidationModel = _isValidJson(json);
  if (!jsonValidationModel.isValid) {
    flatUnflatJsonModel.error = true;
    flatUnflatJsonModel.errorMessage = jsonValidationModel.errorMessage;
    return flatUnflatJsonModel;
  }
  const flattenOptions = { delimiter: '.', safe: false };
  try {
    let jsonObject = jsonValidationModel.jsonData;
    flatUnflatJsonModel.flattenedJsonObject = flatten(jsonObject, flattenOptions);
  } catch (error) {
    flatUnflatJsonModel.error = true;
    flatUnflatJsonModel.errorMessage = error.message;
  }
  return flatUnflatJsonModel;
}

function getNativeType(value) {
  if (value.length < 1) {
    return null;
  }
  if (!isNaN(value)) {
    return parseFloat(value);
  }
  if (value.trim() === 'true') {
    return true;
  }
  if (value.trim() === 'false') {
    return false;
  }
  return value;
}

function validatePropertyText(propertyText) {
  let errorModel = new GenericErrorModel();
  if (!propertyText || propertyText.length < 1) {
    errorModel.error = true;
    errorModel.errorMessage = 'Invalid Properties';
    return errorModel;
  }
  try {
    // checking input is json or property
    JSON.parse(propertyText);
    errorModel.error = true;
    errorModel.errorMessage = 'Incorrect Properties';
    return errorModel;
  } catch (error) {

  }
  if (propertyText.trim().startsWith('<')) {
    errorModel.error = true;
    errorModel.errorMessage = 'Incorrect Properties';
  }
  return errorModel;
}

export default handlers;
