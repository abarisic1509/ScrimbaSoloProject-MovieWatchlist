
const resultContainer = document.getElementById('results')

function fetchMovies() {
    for (let [key] of Object.entries(localStorage)) {
        fetch(`http://www.omdbapi.com/?apikey=97ba63aa&t=${JSON.stringify(key)}`)
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
                    <button class="watchlist-btn" id="${id}"onclick="removeMovie('${title}', '${id}')"><i class="fa-solid fa-circle-minus"></i>Remove</button>
                    </div>
                </div>
                <p class="result-box__description">${description}</p>
            </div>
            <img src="${poster}" class="result-box__img">
        </div>
    `
}

function removeMovie(name, id) {
    localStorage.removeItem(name, id)
    resultContainer.innerHTML = ''
    fetchMovies()
}

fetchMovies()