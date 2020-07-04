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
 * An array of pics' id and alternative text
 * @const {!Array<{id: string, alt: string}>}
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

function addImagesToGallery() {
  const imgContainer = document.getElementById('gallery-container');

  for (const pic of GALLERY_PICS) {
    const newImg = document.createElement('img');

    newImg.setAttribute('id', pic.id);
    newImg.setAttribute('src', `/images/${pic.id}`);
    newImg.setAttribute('alt', pic.alt);
    newImg.setAttribute('role','button');
    newImg.addEventListener('click', (event) => {
      getComments(event.target.id); // comments.js
    });

    imgContainer.appendChild(newImg);
  }
}

// Add images to gallery when body is loaded
if (document.readyState === 'loading') {
  // loading yet, wait for the event
  document.addEventListener('DOMContentLoaded', addImagesToGallery);
} else {
  // DOM is ready!
  addImagesToGallery();
}