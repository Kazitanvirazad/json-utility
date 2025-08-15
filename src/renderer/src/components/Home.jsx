"use strict"

import Buttons from './hompage/Buttons';
import Input from './hompage/Input';
import TextContainer from './hompage/TextContainer';
import {
  handleTabKeyIndent,
  prettifyJson,
  isValidJson,
  minifyJson,
  copyToClipboard,
  setText,
  setRawText,
  convertToXmlFromJson,
  convertToJsonFromXml,
  clearAllText,
  handleEnterKeyOnSearchBoxEvent,
  createPropertyFromJson,
  createJsonFromProperty,
  handleEnterKeyOnReplaceBoxEvent,
  convertJsonToYaml,
  convertYamlToJson
} from '../utils/bridgeRenderHelpers.mjs';

function Home() {
  const clearAllPrompts = () => {
    const elementIds = ['prompt-error', 'prompt-success', 'input-error'];
    clearAllText(elementIds);
  };

  const handleValidateJson = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const jsontext = textContainer.value;
    let jsonValidationModel = await isValidJson(jsontext);
    if (jsonValidationModel.isValid) {
      setText('Valid Json', document.getElementById('prompt-success'));
    } else {
      setText(jsonValidationModel.errorMessage, document.getElementById('prompt-error'));
    }
  };

  const handlePrettifyJson = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const jsontext = textContainer.value;
    const indent = document.getElementById('indent-container').value;
    let prettifiedJsonModel = await prettifyJson(jsontext, indent);
    if (prettifiedJsonModel.jsonValidity.isValid) {
      setRawText(prettifiedJsonModel.prettifiedJson, document.getElementById('text-container'));
    } else {
      setText(
        prettifiedJsonModel.jsonValidity.errorMessage,
        document.getElementById(prettifiedJsonModel.isIndentInvalid ? 'input-error' : 'prompt-error')
      );
    }
  };

  const handleMinifyJson = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const jsontext = textContainer.value;
    let minifiedJsonModel = await minifyJson(jsontext);
    if (minifiedJsonModel.jsonValidity.isValid) {
      setRawText(minifiedJsonModel.minifiedJson, document.getElementById('text-container'));
    } else {
      setText(minifiedJsonModel.jsonValidity.errorMessage, document.getElementById('prompt-error'));
    }
  };

  const handleConvertToXmlFromJson = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const jsontext = textContainer.value;
    let xmlModel = await convertToXmlFromJson(jsontext);
    if (xmlModel.xmlValidity.isValid) {
      setRawText(xmlModel.xmlData, document.getElementById('text-container'));
    } else {
      setText(xmlModel.xmlValidity.errorMessage, document.getElementById('prompt-error'));
    }
  };

  const handleConvertToJsonFromXml = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const xmlText = textContainer.value;
    let jsonModel = await convertToJsonFromXml(xmlText);
    if (jsonModel.jsonValidity.isValid) {
      setRawText(jsonModel.jsonText, document.getElementById('text-container'));
    } else {
      setText(jsonModel.jsonValidity.errorMessage, document.getElementById('prompt-error'));
    }
  };

  const handleCopyToClipboard = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const jsontext = textContainer.value;
    if (!jsontext) {
      setText('Nothing to copy', document.getElementById('prompt-error'));
    } else {
      await copyToClipboard(jsontext);
      setText('Copied to clipboard', document.getElementById('prompt-success'));
    }
  };

  const handleCreatePropertyFromJson = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const jsontext = textContainer.value;
    let flatUnflatJsonModel = await createPropertyFromJson(jsontext);
    if (!flatUnflatJsonModel.error) {
      setRawText(flatUnflatJsonModel.propertyText, document.getElementById('text-container'));
    } else {
      setText(flatUnflatJsonModel.errorMessage, document.getElementById('prompt-error'));
    }
  };

  const handleCreateJsonFromProperty = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const propertyText = textContainer.value;
    let flatUnflatJsonModel = await createJsonFromProperty(propertyText);
    if (!flatUnflatJsonModel.error) {
      setRawText(flatUnflatJsonModel.unflattenedJsonString, document.getElementById('text-container'));
    } else {
      setText(flatUnflatJsonModel.errorMessage, document.getElementById('prompt-error'));
    }
  };

  const handleConvertJsonToYaml = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const jsontext = textContainer.value;
    let yamlModel = await convertJsonToYaml(jsontext);
    if (!yamlModel.error) {
      setRawText(yamlModel.yamlText, document.getElementById('text-container'));
    } else {
      setText(yamlModel.errorMessage, document.getElementById('prompt-error'));
    }
  };

  const handleConvertYamlToJson = async () => {
    clearAllPrompts();
    const textContainer = document.getElementById('text-container');
    const yamlText = textContainer.value;
    let jsonModel = await convertYamlToJson(yamlText);
    if (jsonModel.jsonValidity.isValid) {
      setRawText(jsonModel.jsonText, document.getElementById('text-container'));
    } else {
      setText(jsonModel.jsonValidity.errorMessage, document.getElementById('prompt-error'));
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="unselectable">JSON Utility</h2>
        <TextContainer tabKeyIndent={handleTabKeyIndent} />
        {/* <div className="textarea-container">
          <textarea id="text-container" placeholder="Enter json text" onKeyDown={handleTabKeyIndent}></textarea>
          <div className="validation-message">
            <div id="prompt-error" className='error unselectable'></div>
            <div id="prompt-success" className="success unselectable"></div>
          </div>
        </div> */}
        <Input
          enterKeyOnSearchBoxEvent={handleEnterKeyOnSearchBoxEvent}
          enterKeyOnReplaceBoxEvent={handleEnterKeyOnReplaceBoxEvent} />
        <Buttons
          prettifyJson={handlePrettifyJson}
          validateJson={handleValidateJson}
          convertJsonToYaml={handleConvertJsonToYaml}
          createPropertyFromJson={handleCreatePropertyFromJson}
          convertToXmlFromJson={handleConvertToXmlFromJson}
          minifyJson={handleMinifyJson}
          copyToClipboard={handleCopyToClipboard}
          convertYamlToJson={handleConvertYamlToJson}
          createJsonFromProperty={handleCreateJsonFromProperty}
          convertToJsonFromXml={handleConvertToJsonFromXml} />
      </div>
    </>
  );
}

export default Home;
