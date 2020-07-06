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

/** @const {URLSearchParams} QUERY_STRING Keep track of the querystring*/
const QUERY_STRING = new URLSearchParams(window.location.search);

/**
 * Check if the querystring has a paramater,
 * if true, then execute the function provided
 * @param {string} param The parameter to check for in the query string
 * @param {function} doFunc The function to execute if the parameter exists
 */
function hasQueryString(param, doFunc) {
  if (QUERY_STRING.has(param)) {
    doFunc();
  }
}

/**
 * An array of pics' id and alternative text
 * @const {!Array<{id: string, alt: string}>} GALLERY_PICS
 */
const GALLERY_PICS = [
  {
    id: 'FifiAndPanda.jpg',
    alt: 'Fifi and Panda. In front, in the lower left corner a toy panda ' + 
        'waving his hand. In the back, a sleeping white and cream chihuaha.'
  },
  {
    id: 'HappyFifi.jpg',
    alt: 'Happy Fifi. In the center, a white and cream chihuahua being ' + 
        'petted on the head.'
  },
  {
    id: 'FifiLooksAtPanda.jpg',
    alt: 'Fifi looking at Panda. In front, in the lower left corner a ' + 
        'toy panda. In the back, a white and cream chihuaha looking at ' + 
        'the toy panda.'
  },
  {
    id: 'GuayabaGrabbed.jpg',
    alt: 'Between the leaves, a guava is visible, hanging from the branch, ' + 
        'grabbed by a hand. Ready to be harvested.'
  },
  {
    id: 'DogsHouse.jpg',
    alt: 'A dog house, two dogs inside it. A sleeping brown and white ' + 
        'beagle and a white and cream chihuaha looking to the camera. ' + 
        'Outside, a sunny day and flower pots.'
  },
  {
    id: 'GuayabasTree.jpg',
    alt: 'A close look to a guava tree. A bunch of branches and green ' + 
        'leaves. Two guavas are hanging from it.'
  },
  {
    id: 'ProfileLaika.jpg',
    alt: 'Laika. A close look from bottom to top of a brown and white ' + 
        'beagle head inside a living room.'
  },
  {
    id: 'BeautifulLaika.jpg',
    alt: 'Laika. A close look from a side of a brown and white beagle ' + 
        'head with his mouth open and tongue out.'
  },
  {
    id: 'PandaHugsLaika.jpg',
    alt: 'Panda hugging Laika. A toy panda hugging a brown and white ' + 
        'beagle lying in the floor. The toy panda is small, it is ' + 
        'hugging the ear of the dog.'
  }
];

/**
 * Create the img elements and add them to gallery
 */
function addImagesToGallery() {
  const imgContainer = document.getElementById('gallery-container');

  for (const pic of GALLERY_PICS) {
    const newImg = document.createElement('img');

    newImg.setAttribute('id', pic.id);
    newImg.setAttribute('src', `/images/${pic.id}`);
    newImg.setAttribute('alt', pic.alt);
    newImg.setAttribute('role','button');
    newImg.addEventListener('click', (event) => {
      window.location.hash = 'expanded-image-container';
      window.location.search = `imageId=${pic.id}`;
    });

    imgContainer.appendChild(newImg);
  }
}

/**
 * Expand the clicked image and show comments section
 * @param {Object} image The img element of the clicked image
 */
function expandImg(image) {
  // Hide gallery and show expanded image
  document.getElementById('gallery-container').style.display = 'none';
  document.getElementById('expanded-image-container').style.display = 'flex';

  // Add attributes to expanded image
  const expandedImg = document.getElementById('expanded-image');

  expandedImg.src = image.src;
  expandedImg.alt = image.alt;

  // Specify element id to which apply GET and POST requests
  document.getElementById('delete-comments').value = image.id;  
  document.querySelectorAll('input[type=hidden]').forEach((input) => {
    input.value = image.id;
  });
}

/**
 * Hide the expanded image and show the gallery
 */
function closeImg() {
  window.location = `${window.location.pathname}#gallery-container`;
}

// Add images to gallery when body is loaded
if (document.readyState === 'loading') {
  // loading yet, wait for the event
  document.addEventListener('DOMContentLoaded', () => {
    addImagesToGallery();
    hasQueryString('imageId', () => {
      expandImg(document.getElementById(QUERY_STRING.get('imageId')));
    });
  });
} else {
  // DOM is ready!
  addImagesToGallery();
  hasQueryString('imageId', () => {
    expandImg(document.getElementById(QUERY_STRING.get('imageId')));
  });
}