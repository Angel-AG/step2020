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
 * Fetches comments from the server and adds it to the DOM.
 */
function getComments(event) {
  let url = '/comments';
  if (event.currentTarget.value !== undefined) {
    url = url + '?' + 
        event.currentTarget.name + '=' + event.currentTarget.value;
  }

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

document.body.onload = getComments;
document.getElementById("quantity").onchange = getComments;