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
  imageId: '',
  quantity: '5',
  dateDescending: 'true'
});

/**
 * Delete all the comments
 */
function deleteAllComments(imageId) {
  const postParams = new URLSearchParams();
  postParams.append('imageId', imageId);

  fetch('/delete-comments', {method: 'POST', body: postParams}).then(response => {
    if (response.status === 200) {
      getComments();
    } else {
      alert('Sorry, we could not process your request. ' +
          'Reload the page and try again.');
    }
  });
}

/**
 * Fetches comments from the server and adds them to the DOM.
 */
function getComments() {
  fetch(`/get-comments?${GET_PARAMS.toString()}`).then((response) => {
    if (response.status === 200) {
      response.json().then((comments) => {
        const commentsContainer = document.querySelector('#comments-container');
        
        removeCommentsFromDom(commentsContainer);
        addCommentsToDom(comments, commentsContainer);
      });
    }
    else {
      alert('Sorry, we could not process your request. ' +
          'Reload the page and try again.');
    }
  });
}

/**
 * Remove children of a HTML node
 * @param {Element} node The HTML node, element.
 */
function removeCommentsFromDom(node) {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
}

/**
 * Adds comments to a container using a template
 * @param {!Array<{Object}>} comments The comments to add
 * @param {Element} container The container to place comments inside
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

/**
 * Set up functions for when comment section events are triggered
 */
function init() {
  // Listen to changes in the quantity of comments to display
  document.getElementById('quantity').addEventListener('change', (event) => {
    GET_PARAMS.set('quantity', event.target.value);
    getComments();
  });

  // Listen to changes in the order to display comments
  document.getElementById('dateDescending').addEventListener('change', (event) => {
    GET_PARAMS.set('dateDescending', event.target.checked);
    getComments();
  });

  // Listen to when the delete buttons is clicked
  document.getElementById('delete-comments').addEventListener('click', (event) => {
    deleteAllComments(event.target.value);
  });
}

// Set up comments when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  init();
  // Function in gallery.js
  hasQueryString('imageId', () => {
    GET_PARAMS.set('imageId', QUERY_STRING.get('imageId'));
    getComments();
  });
});
