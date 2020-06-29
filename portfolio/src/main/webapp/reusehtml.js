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
 * Adds HTML content to elements with the include-html attribute
 */
function includeHtml() {
  const elementsWithIncludeAttr = document.querySelectorAll("[include-html]");

  for (const element of elementsWithIncludeAttr) {
    // Get the file name
    const path = element.getAttribute("include-html");
    
    // Check path is not an empty string
    if (path) {
      // Make an HTTP Request for the HTML file
      const xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4) {
          if (xmlHttp.status === 200) {element.innerHTML = xmlHttp.responseText;};
          if (xmlHttp.status === 404) {element.innerHTML = "Page not found";};
        
          element.removeAttribute("include-html");
        }
      };
      xmlHttp.open("GET", path, true);
      xmlHttp.send();
    }
  }
}

/**
 * Listens to when the HTML document has been completely loaded and parsed
 */
document.addEventListener("DOMContentLoaded", () => {
  includeHtml();
});
