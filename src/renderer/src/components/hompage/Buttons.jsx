"use strict"

const Buttons = ({
  prettifyJson,
  validateJson,
  convertJsonToYaml,
  createPropertyFromJson,
  convertToXmlFromJson,
  minifyJson,
  copyToClipboard,
  convertYamlToJson,
  createJsonFromProperty,
  convertToJsonFromXml
}) => {
  return (
    <>
      <div className="button-group">
        <button className="btn" onClick={prettifyJson}>Beautify Json</button>
        <button className="btn" onClick={validateJson}>Validate Json</button>
        <button className="btn" onClick={convertJsonToYaml}>Json &rarr;	Yaml</button>
        <button className="btn" onClick={createPropertyFromJson}>Json &rarr;	Property</button>
        <button className="btn" onClick={convertToXmlFromJson}>Json &rarr;	Xml</button>
      </div>
      <div className="button-group">
        <button className="btn" onClick={minifyJson}>Minify Json</button>
        <button className="btn" onClick={copyToClipboard}>Copy to Clipboard</button>
        <button className="btn" onClick={convertYamlToJson}>Yaml &rarr;	Json</button>
        <button className="btn" onClick={createJsonFromProperty}>Property &rarr;	Json</button>
        <button className="btn" onClick={convertToJsonFromXml}>Xml &rarr;	Json</button>
      </div>
    </>
  );
};

export default Buttons;