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
 * An object to manage the query string of a URL
 * @const {URLSearchParams}
 */
const GET_PARAMS = new URLSearchParams ({
  quantity: '5',
  dateOrder: 'true'
});

/**
 * Fetches comments from the server and adds it to the DOM.
 */
function getComments() {
  const url = '/comments?' + GET_PARAMS.toString();

  fetch(url).then(response => response.json()).then((comments) => {
    const commentsContainer = document.querySelector('#comments-container');
    
    removeNodeChildren(commentsContainer);
    addCommentsToDom(comments, commentsContainer);
  });
}

/**
 * Remove children of a HTML node
 * @param {Object} node The HTML node, element.
 */
function removeNodeChildren(node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}

/**
 * Adds comments to a container using a template
 * @param {!Array<{Object}>} comments The comments to add
 * @param {Object} container The container to place comments inside
 */
function addCommentsToDom(comments, container) {
  const commentTemplate = document.querySelector('#comment-card');

  for (const comment of comments) {
    const newComment = commentTemplate.content.cloneNode(true);

    newComment.querySelector('h4').textContent = comment.username;
    newComment.querySelector('span').textContent = comment.date;
    newComment.querySelector('p').textContent = comment.comment;

    container.appendChild(newComment);
  }
}

function setUpComments() {
  // Listen to changes in the quantity of comments to display
  document.getElementById("quantity").onchange = (event) => {
    GET_PARAMS.set('quantity', event.currentTarget.value);
    getComments();
  };

  // Listen to changes in the order to display comments
  document.getElementById("dateOrder").onchange = (event) => {
    GET_PARAMS.set('dateOrder', event.currentTarget.checked);
    getComments();
  };

  getComments();
}

// Set up comments when DOM is loaded
if (document.readyState === 'loading') {
  // loading yet, wait for the event
  document.addEventListener('DOMContentLoaded', setUpComments);
} else {
  // DOM is ready!
  setUpComments();
}
