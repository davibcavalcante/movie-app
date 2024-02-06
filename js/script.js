// DOM
const cardContainer = document.querySelector('.cards-container')
const form = document.querySelector('#form')
const nextPageButton = document.querySelector('#next-page-btn')
const prevPageButton = document.querySelector('#prev-page-btn')
const pageButtons = document.querySelectorAll('.page-btn')
const pageScreen = document.querySelector('.page-screen')
let page = 1

//API
const apiKey = '2b21d003774586cf790725e8c1ef411d'


// FUNCTIONS
async function requestApi(key, page) {
  const request = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${key}&page=${page}`)
  const response = await request.json()
  createCards(response)
}

async function requestSearchApi(key, search) {
  const requestSearch = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${search}`)
  const searchResponse = await requestSearch.json()
  if (searchResponse.results.length === 0) return
  cardContainer.innerHTML = ''
  createCards(searchResponse)
}

function createCards(response) {
  const movies = response.results
  movies.forEach((movie) => {
    if (movie.poster_path === null || movie.overview === '') return
    const titleMovies = verifyChar(movie.title)
    cardContainer.innerHTML += `
    <section class="card">
      <img src="https://image.tmdb.org/t/p/w1280/${movie.poster_path}">
      <section class="info">
          <section class="visible-info">
              <section class="title-date">
                  <h1>${titleMovies}</h1>
                  <h2>${movie.release_date}</h2>
              </section>
          </section>
          <section class="invisible-info">
              <p class="plot">${movie.overview}</p>
          </section>
      </section>
    </section>
    `
  })
}

function verifyChar(title) {
  if (title.length >= 20) {
    title = title.slice(0, 20)
    title = title + '...'
  }

  return title
}

function updateButtons() {
  pageButtons.forEach((btn, index) => {
    if (index === 0) btn.innerText = page + 1
    if (index === 1) btn.innerText = page + 2
    if (index === 2) btn.innerText = page + 3
  })
}

function updatePageScreen() {
  pageScreen.innerText = `Page: ${page}`
}

// EVENTS
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const searchInput = document.querySelector('#search-input').value
  if (searchInput === '') return
  requestSearchApi(apiKey, searchInput)
})

nextPageButton.addEventListener('click', () => {
  if (page < 500) {
    cardContainer.innerHTML = ''
    page = ++page
    updateButtons()
    updatePageScreen()
    requestApi(apiKey, page)
  }
  
})

prevPageButton.addEventListener('click', () => {
  if (page > 1) {
    cardContainer.innerHTML = ''
    page = --page
    updateButtons()
    updatePageScreen()
    requestApi(apiKey, page)
  }
})

pageButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      page = Number(btn.innerText)
      cardContainer.innerHTML = ''
      updateButtons()
      updatePageScreen()
      requestApi(apiKey, page)
    })
})

updatePageScreen()
requestApi(apiKey, page)