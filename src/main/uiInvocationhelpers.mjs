'use strict'
import { JsonValidationModel, PrettifiedJsonModel, MinifiedJsonModel } from './dto/models.mjs'
import { clipboard } from 'electron'

const _fallbackIndent = 4

const uiHelpers = [
  {
    _name: 'isValidJson',
    _function: (event, value) => {
      return _isValidJson(value)
    }
  },
  {
    _name: 'prettifyJson',
    _function: (event, value, indent) => {
      return _prettifyJson(value, indent)
    }
  },
  {
    _name: 'minifyJson',
    _function: (event, value) => {
      return _minifyJson(value)
    }
  },
  {
    _name: 'copyToClipboard',
    _function: (event, value) => {
      if (value) clipboard.writeText(value)
    }
  }
]

function _minifyJson(json) {
  let minifiedJsonModel = new MinifiedJsonModel()
  let jsonValidationModel = _isValidJson(json)
  if (!jsonValidationModel.isValid) {
    minifiedJsonModel.jsonValidity.errorMessage = jsonValidationModel.errorMessage
    return minifiedJsonModel
  }
  let json0bject = JSON.parse(json)
  minifiedJsonModel.minifiedJson = JSON.stringify(json0bject, null, 0)
  minifiedJsonModel.jsonValidity.isValid = true
  return minifiedJsonModel
}

function _prettifyJson(json, indent) {
  let prettifiedJsonModel = new PrettifiedJsonModel()
  let jsonValidationModel = _isValidJson(json)
  if (!jsonValidationModel.isValid) {
    prettifiedJsonModel.jsonValidity.errorMessage = jsonValidationModel.errorMessage
    return prettifiedJsonModel
  }
  if (indent && !isNaN(indent) && (indent < 0 || indent > 8)) {
    prettifiedJsonModel.jsonValidity.errorMessage = 'Indent must be a number between 0 and 8'
    prettifiedJsonModel.isIndentInvalid = true
    return prettifiedJsonModel
  }
  if (!indent || isNaN(indent)) {
    indent = _fallbackIndent
  }
  let json0bject = JSON.parse(json)
  prettifiedJsonModel.prettifiedJson = JSON.stringify(json0bject, null, Number.parseInt(indent))
  prettifiedJsonModel.jsonValidity.isValid = true
  return prettifiedJsonModel
}

function _isValidJson(json) {
  let jsonValidationModel = new JsonValidationModel()
  if (!json) {
    jsonValidationModel.errorMessage = 'Invalid JSON'
    return jsonValidationModel
  }
  try {
    JSON.parse(json)
    jsonValidationModel.isValid = true
  } catch (error) {
    jsonValidationModel.errorMessage = error.message
  }
  return jsonValidationModel
}

export default uiHelpers
