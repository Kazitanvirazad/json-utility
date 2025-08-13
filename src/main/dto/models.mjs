'use strict'

export class JsonValidationModel {
  constructor(isValid = false, message = '') {
    this.isValid = isValid;
    this.errorMessage = message;
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
