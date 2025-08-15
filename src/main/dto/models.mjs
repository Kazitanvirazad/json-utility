'use strict'

export class JsonValidationModel {
  constructor(isValid = false, message = '') {
    this.isValid = isValid;
    this.errorMessage = message;
    this.jsonData = {};
  }
}

export class XmlValidationModel {
  constructor(isValid = false, message = '') {
    this.isValid = isValid;
    this.errorMessage = message;
  }
}

export class PrettifiedJsonModel {
  constructor() {
    this.jsonValidity = new JsonValidationModel();
    this.prettifiedJson = '';
    this.isIndentInvalid = false;
  }
}

export class MinifiedJsonModel {
  constructor() {
    this.jsonValidity = new JsonValidationModel();
    this.minifiedJson = '';
  }
}

export class JsonModel {
  constructor() {
    this.jsonValidity = new JsonValidationModel();
    this.jsonData = '';
  }
}

export class XMLModel {
  constructor() {
    this.xmlValidity = new XmlValidationModel();
    this.xmlData = '';
  }
}

export class FlatUnflatJsonModel {
  constructor(error = false, message = '') {
    this.error = error;
    this.errorMessage = message;
    this.flattenedJsonObject = {};
    this.propertyText = '';
    this.unflattenedJsonString = '';
  }
}

export class GenericErrorModel {
  constructor(error = false, message = '') {
    this.error = error;
    this.errorMessage = message;
  }
}
