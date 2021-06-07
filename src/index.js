var debounce = require('lodash.debounce');
import API from './fetchCountries';

import countryItemTpl from './templates/countryTpl.hbs';
import countriesListTpl from './templates/countriesListTpl.hbs';
import getRefs from './get-refs';

// import pontyfy styles and js
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import { error } from '@pnotify/core/dist/PNotify.js';

import './sass/main.scss';

const refs = getRefs();

refs.searchInput.addEventListener('input', debounce(onInput, 500));

function createCountryMarkup(data) {
  return countryItemTpl(data);
}
function createCountriesList(data) {
  return countriesListTpl(data);
}
function pontyfyMessage(message) {
  error({
    title: `${message}`,
    delay: 1200,
  });
}

function onInput(e) {
  let searchQuery = e.target.value;
  console.log('input changed');
  refs.countryContainer.innerHTML = '';
  if (e.target.value !== '' && e.target.value !== ' ' && e.target.value !== '.') {
    console.log(searchQuery);
    API.fetchCountries(searchQuery).then(data => {
      if (data.status === 404) {
        pontyfyMessage('Nothing was found for your query!');
      } else if (data.length > 10) {
        pontyfyMessage('Too many matches found. Please enter more specific query!');
      } else if (data.length === 1) {
        const countryMarkup = createCountryMarkup(data);
        refs.countryContainer.insertAdjacentHTML('beforeend', countryMarkup);
      } else if (2 <= data.length <= 10) {
        const countriesList = createCountriesList(data);
        refs.countryContainer.insertAdjacentHTML('beforeend', countriesList);
      }
    });
  }
}
