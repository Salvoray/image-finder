// import './io';
import './sass/main.scss';
import 'material-design-icons/iconfont/material-icons.css';
import ImagesApiService from './api-services/apiService';
import searchFrom from './templates/searchFrom.hbs';
import imagesListTpl from './templates/imagesList.hbs';

document.body.insertAdjacentHTML('afterbegin', searchFrom());

const searchFormRef = document.querySelector('#search-form');
const listContainerRef = document.querySelector('.gallery');

const imagesApiService = new ImagesApiService();

const makeImagesMarkup = images => {
  listContainerRef.insertAdjacentHTML('beforeend', imagesListTpl(images));
};

const clearImagesMarkup = () => {
  listContainerRef.innerHTML = '';
};

const onFormSearch = e => {
  e.preventDefault();
  imagesApiService.query = e.currentTarget.query.value;
  imagesApiService.resetPage();
  clearImagesMarkup();
  imagesApiService.fetchImages().then(images => {
    makeImagesMarkup(images);
    imagesApiService.incrementPage();
  });
};

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesApiService.query !== '') {
      imagesApiService.fetchImages().then(images => {
        makeImagesMarkup(images);
        imagesApiService.incrementPage();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
observer.observe(sentinel);

searchFormRef.addEventListener('submit', onFormSearch);
