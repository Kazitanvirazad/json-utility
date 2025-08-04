'use strict'

export class JsonValidationModel {
  constructor(isValid = false, message = '') {
    this.isValid = isValid
    this.errorMessage = message
  }
}

export class PrettifiedJsonModel {
  constructor() {
    this.jsonValidity = new JsonValidationModel()
    this.prettifiedJson = ''
    this.isIndentInvalid = false
  }
}

export class MinifiedJsonModel {
  constructor() {
    this.jsonValidity = new JsonValidationModel()
    this.minifiedJson = ''
  }
}
