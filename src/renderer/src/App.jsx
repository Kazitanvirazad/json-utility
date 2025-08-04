import {
  handleTabKeyIndent,
  prettifyJson,
  isValidJson,
  minifyJson,
  copyToClipboard,
  setText,
  setRawText,
  clearText
} from './utils/utilhelper.mjs'

function App() {
  const handleValidateJson = async () => {
    clearText(document.getElementById('json-error'))
    clearText(document.getElementById('json-success'))
    clearText(document.getElementById('indent-error'))
    const jsonTextContainer = document.getElementById('text-container')
    const jsontext = jsonTextContainer.value
    let jsonValidationModel = await isValidJson(jsontext)
    if (jsonValidationModel.isValid) {
      setText('Valid Json', document.getElementById('json-success'))
    } else {
      setText(jsonValidationModel.errorMessage, document.getElementById('json-error'))
    }
  }

  const handlePrettifyJson = async () => {
    clearText(document.getElementById('json-error'))
    clearText(document.getElementById('json-success'))
    clearText(document.getElementById('indent-error'))
    const jsonTextContainer = document.getElementById('text-container')
    const jsontext = jsonTextContainer.value
    const indent = document.getElementById('indent-container').value
    let prettifiedJsonModel = await prettifyJson(jsontext, indent)
    if (prettifiedJsonModel.jsonValidity.isValid) {
      setRawText(prettifiedJsonModel.prettifiedJson, document.getElementById('text-container'))
    } else {
      setText(
        prettifiedJsonModel.jsonValidity.errorMessage,
        document.getElementById(prettifiedJsonModel.isIndentInvalid ? 'indent-error' : 'json-error')
      )
    }
  }

  const handleMinifyJson = async () => {
    console.info('Minify function called')
    clearText(document.getElementById('json-error'))
    clearText(document.getElementById('json-success'))
    clearText(document.getElementById('indent-error'))
    const jsonTextContainer = document.getElementById('text-container')
    const jsontext = jsonTextContainer.value
    let minifiedJsonModel = await minifyJson(jsontext)
    if (minifiedJsonModel.jsonValidity.isValid) {
      setRawText(minifiedJsonModel.minifiedJson, document.getElementById('text-container'))
    } else {
      setText(minifiedJsonModel.jsonValidity.errorMessage, document.getElementById('json-error'))
    }
  }

  const handleCopyToClipboard = async () => {
    clearText(document.getElementById('json-error'))
    clearText(document.getElementById('json-success'))
    clearText(document.getElementById('indent-error'))
    const jsonTextContainer = document.getElementById('text-container')
    const jsontext = jsonTextContainer.value
    if (!jsontext) {
      setText('Nothing to copy', document.getElementById('json-error'))
    } else {
      await copyToClipboard(jsontext)
      setText('Copied to clipboard', document.getElementById('json-success'))
    }
  }

  return (
    <>
      <div className="container">
        <h2>JSON Utility</h2>
        <div className="textarea-container">
          <textarea id="text-container" placeholder="Enter json string" onKeyDown={handleTabKeyIndent}></textarea>
          <div className="validation-message">
            <div id="json-error" className='error'></div>
            <div id="json-success" className="success"></div>
          </div>
        </div>
        <div>
          <input id="indent-container" type="text" className="indent-box" placeholder="Indent 0 to 8"></input>
          <div id="indent-error" className="validation-message error"></div>
        </div>
        <div className="button-group">
          <button className="btn" onClick={handlePrettifyJson}>Prettify</button>
          <button className="btn" onClick={handleMinifyJson}>Minify</button>
          <button className="btn" onClick={handleValidateJson}>Validate</button>
          <button className="btn" onClick={handleCopyToClipboard}>Copy to clipboard</button>
        </div>
        <div className="button-group">
          <button className="btn">JSON &harr;	PROPERTY</button>
          <button className="btn">JSON &harr;	XML</button>
        </div>
      </div>
    </>
  );
}

export default App
