'use strict'

export const handleTabKeyIndent = (event) => {
  if (event.key === 'Tab') {
    event.preventDefault();
    const textarea = event.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const tab = '    ';
    textarea.value = textarea.value.substring(0, start) + tab + textarea.value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + tab.length;
  }
}

export const isValidJson = async (json) => {
  return await window.uiHandlers.isValidJson(json);
}

export const prettifyJson = async (json, indent) => {
  return await window.uiHandlers.prettifyJson(json, indent);
}

export const minifyJson = async (json) => {
  return await window.uiHandlers.minifyJson(json);
}

export const copyToClipboard = async (value) => {
  await window.uiHandlers.copyToClipboard(value);
  return
}

export const convertToXmlFromJson = async (json) => {
  return await window.uiHandlers.convertToXmlFromJson(json);
}

export const convertToJsonFromXml = async (xml) => {
  return await window.uiHandlers.convertToJsonFromXml(xml);
}

export function setText(txt, htmlElement) {
  htmlElement.innerHTML = `<span>${txt}</span>`;
}

export function setRawText(rawText, htmlElement) {
  htmlElement.value = rawText;
}

export function clearText(htmlElement) {
  htmlElement.innerHTML = '';
}

export function clearAllText(elementIds) {
  for (let elementId of elementIds) {
    let htmlElement = document.getElementById(elementId);
    if (htmlElement)
      clearText(htmlElement);
  }
}
