"use strict";

const TextContainer = ({ tabKeyIndent }) => {
  return (
    <>
      <div className="textarea-container">
        <textarea id="text-container" placeholder="Enter json text" onKeyDown={tabKeyIndent}></textarea>
        <div className="validation-message">
          <div id="prompt-error" className='error unselectable'></div>
          <div id="prompt-success" className="success unselectable"></div>
        </div>
      </div>
    </>
  );
};

export default TextContainer;