// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * Alters the inner html of an HTML element, depending on the 
 * request's state and the HTTP response status code.
 * XML HTTP Request states:
 * - 0 UNSET
 * - 1 OPENED
 * - 2 HEADERS_RECEIVED
 * - 3 LOADING
 * - 4 DONE
 * @param {Object} xmlHttp XMLHttpRequest to monitor the progress
 * @param {Object} element HTML element to alter its inner content
 */
function alterHtml(xmlHttp, element) {
  if (xmlHttp.readyState < 4) {
    element.innerHTML = "Loading...";
  } else if (xmlHttp.readyState === 4) {
    if (xmlHttp.status === 200) {
      element.innerHTML = xmlHttp.responseText;
    } else if (xmlHttp.status === 404) {
      element.innerHTML = "Page not found";
    } else if (xmlHttp.status === 0) {
      element.innerHTML = "Timeout. Unable to reach server";
    } else {
      element.innerHTML = "Something unexpected occurred " + 
          xmlHttp.status + " " + xmlHttp.statusText;
    }
    
    element.removeAttribute("include-html");
  }
}

/**
 * Make an HTTP Request for the HTML file.
 * @param {Object} htmlElement HTML element to alter its content
 * @param {string} htmlPath Path to the HTML file
 * @param {function} timeoutFunc Function to fire when timeout is reached
 */
function requestHtmlFile(htmlElement, htmlPath, timeoutFunc) {
  const xmlHttp = new XMLHttpRequest();
  
  xmlHttp.onreadystatechange = () => {
    alterHtml(xmlHttp, htmlElement);
  };

  xmlHttp.open("GET", htmlPath, true);

  xmlHttp.onerror = () => {
    alert("Sorry. An error occurred during the request");
  };
  
  xmlHttp.timeout = 5000; // milliseconds 
  xmlHttp.ontimeout = timeoutFunc;

  xmlHttp.send();
}

/**
 * Adds HTML content to elements with the include-html attribute
 */
function includeHtml() {
  const elementsWithIncludeAttr = document.querySelectorAll("[include-html]");

  for (const element of elementsWithIncludeAttr) {
    // Get the file name
    const path = element.getAttribute("include-html");
    
    // Check path is not an empty string
    if (path) {
      // Two tries to request the file
      const repeat = function() {requestHtmlFile(element, path, () => {});};
      requestHtmlFile(element, path, repeat);
    }
  }
}

/**
 * Listens to when the HTML document has been completely loaded and parsed
 */
document.addEventListener("DOMContentLoaded", () => {
  includeHtml();
});
