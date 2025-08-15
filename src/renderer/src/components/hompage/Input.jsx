"use strict"

const Input = ({ enterKeyOnSearchBoxEvent, enterKeyOnReplaceBoxEvent }) => {
  return (
    <>
      <div>
        <div>
          <input id="indent-container" type="text" className="input-box indent" placeholder="Json Indent 0 to 8"></input>
          <input id="search-container" type="text" className="input-box search" placeholder="Search &crarr;" onKeyDown={enterKeyOnSearchBoxEvent}></input>
          <input id="replace-container" type="text" className="input-box replace" placeholder="Replace With &crarr;" onKeyDown={enterKeyOnReplaceBoxEvent}></input>
        </div>
        <div id="input-error" className="validation-message error unselectable"></div>
      </div>
    </>
  );
};

export default Input;