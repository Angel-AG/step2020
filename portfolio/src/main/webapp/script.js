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
 * An array of dog pics' source and alternative text
 * @const {Array.<{source: string, alt: string}>}
 */
const RANDOM_DOG_PICS = [
  {
    source: '/images/FifiAndPanda.jpg',
    alt: 'Fifi and Panda. In front, in the lower left corner a toy panda ' + 
        'waving his hand. In the back, a sleeping white and cream chihuaha.'
  },
  {
    source: '/images/HappyFifi.jpg',
    alt: 'Happy Fifi. In the center, a white and cream chihuahua being ' + 
        'petted on the head.'
  },
  {
    source: '/images/FifiLooksAtPanda.jpg',
    alt: 'Fifi looking at Panda. In front, in the lower left corner a ' + 
        'toy panda. In the back, a white and cream chihuaha looking at ' + 
        'the toy panda.'
  },
  {
    source: '/images/DogsHouse.jpg',
    alt: 'A dog house, two dogs inside it. A sleeping brown and white ' + 
        'beagle and a white and cream chihuaha looking to the camera. ' + 
        'Outside, a sunny day and flower pots.'
  },
  {
    source: '/images/ProfileLaika.jpg',
    alt: 'Laika. A close look from bottom to top of a brown and white ' + 
        'beagle head inside a living room.'
  },
  {
    source: '/images/BeautifulLaika.jpg',
    alt: 'Laika. A close look from a side of a brown and white beagle ' + 
        'head with his mouth open and tongue out.'
  },
  {
    source: '/images/PandaHugsLaika.jpg',
    alt: 'Panda hugging Laika. A toy panda hugging a brown and white ' + 
        'beagle lying in the floor. The toy panda is small, it is ' + 
        'hugging the ear of the dog.'
  }
];

/**
 * Adds a random picture of a dog to the page.
 */
function addRandomDogPic() {
  // Pick a random picture.
  const randomDogPic = RANDOM_DOG_PICS[Math.floor(Math.random() * RANDOM_DOG_PICS.length)];

  // Add it to the page.
  const randomImage = document.getElementById('randomImg');
  randomImage.src = randomDogPic.source;
  randomImage.alt = randomDogPic.alt;
}
