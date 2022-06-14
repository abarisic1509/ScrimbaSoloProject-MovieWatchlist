const searchBar = document.getElementById('searchBar')
const inputEl = document.getElementById('inputEl')
const resultContainer = document.getElementById('results')
resultContainer.innerHTML = '<p class="message start-message"><i class="fa-solid fa-film"></i><br>Start exploring</p>'

searchBar.addEventListener('submit', (e) => {
    e.preventDefault()
    const searchFor = inputEl.value
    fetchResults(searchFor)
    inputEl.value = ''
})

function fetchResults(searchValue) {
    resultContainer.innerHTML = ''
    fetch(`http://www.omdbapi.com/?apikey=97ba63aa&s=${searchValue}`)
        .then(res => {
            if(!res.ok) {
                throw Error('Something went wrong')
            }
            return res.json()
        })
        .then(data => {
            const searchResults = data.Search
            for(result of searchResults) {
                fetchMovieData(result.imdbID)
            }
        })
        .catch(err => {
            resultContainer.innerHTML = `<p class="message error-message">Unable to find what you're looking for. Please try again.`
            console.log(err)
        })
}

function fetchMovieData(movieId) {
    fetch(`http://www.omdbapi.com/?apikey=97ba63aa&i=${movieId}`)
        .then(res => {
            if(!res.ok) {
                throw Error('Something went wrong')
            }
            return res.json()
        })
        .then(data => {
            const movieData = [data]
            console.log(movieData)
            for(movie of movieData) {
                renderResults(movie.imdbID, movie.Title, movie.Ratings[0].Value, movie.Runtime, movie.Genre, movie.Plot, movie.Poster)
            }
        })
        .catch(err => console.log(err))
}

function renderResults(id, title, rating, duration, genre, description, poster) {
    resultContainer.innerHTML += `
        <div class="result-box flex">
            <div class="result-box__content">
                <div class="result-box__content-heading flex">
                    <h3>${title}</h3>
                    <p class="rating"><i class="fa-solid fa-star"></i>${rating}</p>
                </div>
                <div class="result-box__content-details flex">
                    <p class="duration">${duration}</p>
                    <p class="genre">${genre}</p>
                    <div class="btn-wrapper">
                        <button class="watchlist-btn" id="${id}" onclick="storeDataToLocal('${title}', '${id}')"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
                    </div>
                </div>
                <p class="result-box__description">${description}</p>
            </div>
            <img src="${poster}" class="result-box__img">
        </div>
    `
}

function storeDataToLocal(name, id) {
    const itemNotSet = (localStorage.getItem('name') === null)
    if(itemNotSet) {
        localStorage.setItem(name, id)
        document.getElementById(id).parentElement.innerHTML = `   <button class="watchlist-btn" id="${id}"            onclick="removeDataFromLocal('${name}', '${id}')"><i class="fa-solid fa-circle-minus"></i>Remove</button>
        `
    } 
}

function removeDataFromLocal(name, id) {
    const itemSet = (localStorage.getItem('name') !== null)
    if(itemSet) {
        localStorage.removeItem(name, id)
        document.getElementById(id).parentElement.innerHTML = `
        <button class="watchlist-btn" id="${id}" onclick="storeDataToLocal('${name}', '${id}')"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
        `
    } 
}
