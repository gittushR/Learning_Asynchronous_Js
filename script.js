'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
function renderCountry(data, className = '') {
  const currencyName = Object.values(data.currencies)[0].name;
  const language = Object.values(data.languages)[0];
  let html = `
        <article class="country ${className}">
          <img class="country__img" src="${data.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} Million people</p>
            <p class="country__row"><span>🗣️</span>${language}</p>
            <p class="country__row"><span>💰</span>${currencyName}</p>
          </div>
        </article>
        `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
}
function renderError(msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
}

// //MOST OLD SCHOOL WAY OF CALLING AJAX FUNCTIONS
// let getCountryAndNeighbor = function (country) {
//   let request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [data] = JSON.parse(this.responseText);
//     console.log(data);
//     //rendering country
//     renderCountry(data);

//     //getting neighbor country
//     let neighbors = data.borders;
//     if (!neighbors) return;
//     neighbors.forEach(neighbor => {
//       //AJAX call country 2
//       let request2 = new XMLHttpRequest();
//       request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbor}`);
//       request2.send();

//       request2.addEventListener('load', function () {
//         const [data2] = JSON.parse(this.responseText);
//         console.log(data2);
//         renderCountry(data2, 'neighbour');
//       });
//     });
//   });
// };

// getCountryAndNeighbor('India');

//MOST OLD SCHOOL WAY OF CALLING AJAX FUNCTIONS
// let getCountryAndNeighbor = function (country) {
//   let request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//Using fetch api
// let request = fetch(`https://restcountries.com/v3.1/name/portugal`);
// console.log(request); //returns a promise

//promises -  placeholder for future values

//handling full filled promises
// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };
function getJSON(url, errorMsg = 'Something went Wrong') {
  return fetch(url).then(response => {
    if (!response.ok) {
      throw new Error(`${errorMsg} (${response.status})`);
    }
    return response.json();
  });
}
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not Found')
    .then(data => {
      console.log(data);
      renderCountry(data[0]);
      if (!data[0].borders) throw new Error('No Neighbor found!');
      const neighbor = data[0].borders[0];
      console.log(neighbor);
      //neighbour country
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbor}`,
        'Country not found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.error(`${err}⛔⛔⛔`);
      renderError(`Something went wrong⛔⛔ ${err.message} Try Again`);
    })
    .finally(function () {
      countriesContainer.style.opacity = 1;
    });
};
// const getCountryData = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`Country Not Found (${response.status})`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       // console.log(data);
//       renderCountry(data[0]);
//       const neighbor = data[0].borders[0];
//       if (!neighbor) return;

//       //neighbour country
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbor}`);
//     })
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`Country Not Found (${response.status})`);
//       }
//       return response.json();
//     })
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => {
//       console.error(`${err}⛔⛔⛔`);
//       renderError(`Something went wrong⛔⛔ ${err.message}. Try Again`);
//     })
//     .finally(function () {
//       countriesContainer.style.opacity = 1;
//     });
// };
btn.addEventListener('click', function () {
  getCountryData('Australia');
});

const whereAmI = function (lat, lng) {
  fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json&auth=335726544549745201601x126588`
  )
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => {
      console.error(`${err}⛔⛔⛔`);
    })
    .finally(function () {
      countriesContainer.style.opacity = 1;
    });
};
whereAmI(52.508, 13.381);
whereAmI(19.0378, 72.873);
whereAmI(-33.933, 18.47);
