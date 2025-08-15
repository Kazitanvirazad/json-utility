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
  handleEnterKeyOnReplaceBoxEvent
} from './utils/bridgeRenderHelpers.mjs';

function App() {
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
      setRawText(jsonModel.jsonData, document.getElementById('text-container'));
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

  return (
    <>
      <div className="container">
        <h2>JSON Utility</h2>
        <div className="textarea-container">
          <textarea id="text-container" placeholder="Enter json text" onKeyDown={handleTabKeyIndent}></textarea>
          <div className="validation-message">
            <div id="prompt-error" className='error'></div>
            <div id="prompt-success" className="success"></div>
          </div>
        </div>
        <div>
          <div>
            <input id="indent-container" type="text" className="input-box indent" placeholder="Json Indent 0 to 8"></input>
            <input id="search-container" type="text" className="input-box search" placeholder="Search &crarr;" onKeyDown={handleEnterKeyOnSearchBoxEvent}></input>
            <input id="replace-container" type="text" className="input-box replace" placeholder="Replace With &crarr;" onKeyDown={handleEnterKeyOnReplaceBoxEvent}></input>
          </div>
          <div id="input-error" className="validation-message error"></div>
        </div>
        <div className="button-group">
          <button className="btn" onClick={handlePrettifyJson}>Beautify Json</button>
          <button className="btn" onClick={handleValidateJson}>Validate Json</button>
          <button className="btn" onClick={handleCreatePropertyFromJson}>Json &rarr;	Yaml</button>
          <button className="btn" onClick={handleCreatePropertyFromJson}>Json &rarr;	Property</button>
          <button className="btn" onClick={handleConvertToXmlFromJson}>Json &rarr;	Xml</button>
        </div>
        <div className="button-group">
          <button className="btn" onClick={handleMinifyJson}>Minify Json</button>
          <button className="btn" onClick={handleCopyToClipboard}>Copy to Clipboard</button>
          <button className="btn" onClick={handleCreateJsonFromProperty}>Yaml &rarr;	Json</button>
          <button className="btn" onClick={handleCreateJsonFromProperty}>Property &rarr;	Json</button>
          <button className="btn" onClick={handleConvertToJsonFromXml}>Xml &rarr;	Json</button>
        </div>
      </div>
    </>
  );
}

export default App;
