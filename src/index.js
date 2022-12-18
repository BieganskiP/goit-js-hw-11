import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('.search-form__input');
const searchButton = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');

const getImages = async searchValue => {
  try {
    const response = await axios.get(
      `https://pixabay.com/api/?key=32129140-b7bda5ae96b59391b71a1c3d8&q=${searchValue}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    console.log(response.data);
    const data = response.data.hits;
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);

    data.forEach(image => displayImgEl(image));
  } catch (error) {
    Notify.failure('Oops, no pictures found');
  }
};
var lightbox = new SimpleLightbox('.gallery a');

const displayImgEl = image => {
  gallery.insertAdjacentHTML(
    'beforeend',
    `<div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.previewURL}" alt="${image.tags}" loading="lazy" />
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
    getImages(searchInput.value.trim());
  }
});
