const selectBy = () => {
    const filterSelect = document.querySelector('#filter-select')
    return filterSelect.value
}

const searchBy = () => {
    const searchInput = document.querySelector('#search-input')
    if (searchInput.value.length > 0) {
        return searchInput.value
    } else {
        return false
    }
}

const getPage = () => {
    const pageString = document.querySelector('.page-screen').innerText
    const pageNumberMatch = pageString.match(/Page:\s*(\d+)/)
    if (pageNumberMatch && pageNumberMatch[1]) {
        return Number(pageNumberMatch[1])
    } else {
        return 1
    }
}

const verifyChar = (title) => {
    if (title.length >= 20) {
        title = title.slice(0, 20)
        title = title + '...'
      }
    
      return title
}

const createCards = (movieData) => {
    const movieList = movieData.results
    const cardContainer = document.querySelector('.cards-container')

    cardContainer.innerHTML = ''

    movieList.forEach((movie) => {
        const moviePoster = movie.poster_path
        const movieReleaseDate = movie.release_date
        const movieTitle = verifyChar(movie.title)

        let moviePlot = movie.overview
        
        if (moviePoster === null) return
        if (moviePlot === '') moviePlot = 'Plot Unknow'

        cardContainer.innerHTML += `
        <section class="card">
        <img src="https://image.tmdb.org/t/p/w1280/${moviePoster}">
        <section class="info">
            <section class="visible-info">
                <section class="title-date">
                    <h1>${movieTitle}</h1>
                    <h2>${movieReleaseDate}</h2>
                </section>
            </section>
            <section class="invisible-info">
                <p class="plot">${moviePlot}</p>
            </section>
        </section>
        </section>
        `
  })
}

const getMovie = async () => {
    let totalPages = 0

    const filter = selectBy()
    const search = searchBy()
    const page = getPage()
    const key = '2b21d003774586cf790725e8c1ef411d'

    if (search) {
        try {
            const result = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${search}&page=${page}`)

            if (!result.ok) {
                
            }

            const data = await result.json()
            totalPages = data.total_pages
            createCards(data)
        } catch (error) {
            console.log(error)
        }
    } else {
        try {
            const result = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&sort_by=${filter}&page=${page}`)

            if (!result.ok) {

            }

            const data = await result.json()
            totalPages = data.total_pages
            createCards(data)
        } catch (error) {
            console.log(error)
        }
    }

    const getTotalPages = () => {
        return totalPages
    }
    
    return { getTotalPages }
}

const updatePageOfButtons = (page) => {
    const pageButtons = document.querySelectorAll('.page-btn')

    pageButtons.forEach((btn, index) => {
        if (index === 0) btn.innerText = page + 1
        if (index === 1) btn.innerText = page + 2
        if (index === 2) btn.innerText = page + 3
    })
}

const updatePage = (page) => {
    const pageScreen = document.querySelector('.page-screen')
    pageScreen.innerText = `Page: ${page}`
    updatePageOfButtons(page)
    return getMovie()
}

const setPageButtonsEvents = () => {
    const nextPageButton = document.querySelector('#next-page-btn')
    const prevPageButton = document.querySelector('#prev-page-btn')
    const pageButtons = document.querySelectorAll('.page-btn')

    nextPageButton.addEventListener('click', async () => {
        let page = getPage()
        const { getTotalPages } = await getMovie()
        const totalPages = getTotalPages()

        if (page < 500 && page < totalPages) {
            page++
            return updatePage(page)
        }
    })

    prevPageButton.addEventListener('click', () => {
        let page = getPage()
        if (page > 1) {
            page--
            return updatePage(page)
        }
    })

    pageButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const pageOfButton = Number(button.innerText)
            updatePage(pageOfButton)
        })
    })
}

const setFormEvents = () => {
    const form = document.querySelector('#form')

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        return getMovie()
    })
}

const setSearchEvents = () => {
    const input = document.querySelector('#search-input')
    input.addEventListener('input', () => {
        if (input.value.length === 0) {
            return getMovie()
        }
    })
}

const setFilterEvents = () => {
    const select = document.querySelector('#filter-select')
    select.addEventListener('change', getMovie)
}

const setEvents = () => {
    setPageButtonsEvents()
    setFormEvents()
    setSearchEvents()
    setFilterEvents()
}

setEvents()
getMovie()