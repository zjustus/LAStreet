import React from 'react';

function DownloadButton({buttonText, jsonData}) {
    const downloadJsonData = () => {
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(jsonData)], {type: 'application/json'});
      element.href = URL.createObjectURL(file);
      element.download = "data.json";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  
    return (
      <button onClick={downloadJsonData}>{buttonText}</button>
    );
  }
  
  export default DownloadButton;