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
  clearAllText
} from './utils/bridgeRenderHelpers.mjs';

function App() {
  const clearAllPrompts = () => {
    const elementIds = ['prompt-error', 'prompt-success', 'indent-error'];
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
        document.getElementById(prettifiedJsonModel.isIndentInvalid ? 'indent-error' : 'prompt-error')
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
          <input id="indent-container" type="text" className="indent-box" placeholder="Indent 0 to 8"></input>
          <div id="indent-error" className="validation-message error"></div>
        </div>
        <div className="button-group">
          <button className="btn" onClick={handlePrettifyJson}>Prettify Json</button>
          <button className="btn" onClick={handleMinifyJson}>Minify Json</button>
          <button className="btn" onClick={handleValidateJson}>Validate Json</button>
          <button className="btn" onClick={handleCopyToClipboard}>Copy to clipboard</button>
        </div>
        <div className="button-group">
          <button className="btn">JSON &harr;	PROPERTY</button>
          <button className="btn" onClick={handleConvertToXmlFromJson}>JSON &rarr;	XML</button>
          <button className="btn" onClick={handleConvertToJsonFromXml}>XML &rarr;	JSON</button>
        </div>
      </div>
    </>
  );
}

export default App;
