import './sass/main.scss';
import 'material-design-icons/iconfont/material-icons.css';
// import ImagesApiService from './api-services/apiService';
import ImagesApiService from './api-services/asyncApiService';
import searchFrom from './templates/searchFrom.hbs';
import imagesListTpl from './templates/imagesList.hbs';

document.body.insertAdjacentHTML('afterbegin', searchFrom());

const searchFormRef = document.querySelector('#search-form');
const listContainerRef = document.querySelector('.gallery');

const imagesApiService = new ImagesApiService();

const makeImagesMarkup = async images => {
  listContainerRef.insertAdjacentHTML('beforeend', imagesListTpl(images));
};

const clearImagesMarkup = () => {
  listContainerRef.innerHTML = '';
};

const onFormSearch = async e => {
  e.preventDefault();
  imagesApiService.query = e.currentTarget.query.value;
  imagesApiService.resetPage();
  clearImagesMarkup();
  const images = await imagesApiService.fetchImages();
  makeImagesMarkup(images);
};

const onEntry = entries => {
  entries.forEach(async entry => {
    if (entry.isIntersecting && imagesApiService.query !== '') {
      const images = await imagesApiService.fetchImages();
      makeImagesMarkup(images);
      imagesApiService.incrementPage();
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(sentinel);

searchFormRef.addEventListener('submit', onFormSearch);
