let debounce = require('lodash.debounce');
import './sass/main.scss';
import countryTpl from './templates/countryTpl.hbs';
import countriesListTpl from './templates/countriesListTpl.hbs';
import API from './fetchCountries';
import getRefs from './get-refs';

import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/mobile/dist/PNotifyMobile.css';
import { error } from '@pnotify/core/dist/PNotify.js';

const refs = getRefs();

refs.searchInput.addEventListener('input', debounce(onInput, 500));

function createCountryMarkup(data) {
  return countryTpl(data);
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

function onError(error) {
  pontyfyMessage(error);
  console.log(error);
}

function onInput(e) {
  const searchQuery = e.target.value;
  console.log(searchQuery);
  refs.countryContainer.innerHTML = '';
  API.fetchCountries(searchQuery)
    .then(data => {
      if (data.status === 404) {
        pontyfyMessage('Nothing was found for your query!');
      } else if (data.length > 10) {
        pontyfyMessage('Too many matches was found. Please enter more specific query!');
      } else if (data.length === 1) {
        const countryMarkup = createCountryMarkup(data);
        refs.countryContainer.insertAdjacentHTML('beforeend', countryMarkup);
        refs.searchInput.value = '';
      } else if (2 <= data.length <= 9) {
        const countriesList = createCountriesList(data);
        refs.countryContainer.insertAdjacentHTML('beforeend', countriesList);
      }
    })
    .catch(onError)
    .finally(() => (refs.searchInput = ''));
}
