import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.search-form__input');
const searchButton = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let pageNumberCounter = 1;
const getImages = async (searchValue, pageNumber) => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=32129140-b7bda5ae96b59391b71a1c3d8&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNumber}`
    );

    const data = response.data.hits;

    data.forEach(image => {
      displayImgEl(image);
    });
    var lightbox = new SimpleLightbox('.gallery a');
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
    // load more button showed when needed
    // loadMore.classList.remove('hidden');

    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
};

const displayImgEl = image => {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${image.likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${image.views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${image.comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${image.downloads}
      </p>
    </div>
  </div>`
  );
};

searchButton.addEventListener('submit', event => {
  gallery.innerHTML = '';

  event.preventDefault();
  if (searchInput.value == '') {
    return;
  } else {
    pageNumberCounter = 1;
    getImages(searchInput.value.trim(), pageNumberCounter);
  }
});

// load more with button

// loadMore.addEventListener('click', event => {
//   event.preventDefault();
//   pageNumberCounter++;
//   getImages(searchInput.value.trim(), pageNumberCounter);
// });
window.addEventListener('scroll', () => {
  console.log('scrolled', window.scrollY); //scrolled from top
  console.log(window.innerHeight); //visible part of screen
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    pageNumberCounter++;
    getImages(searchInput.value.trim(), pageNumberCounter);
  }
});
