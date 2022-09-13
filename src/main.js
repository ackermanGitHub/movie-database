const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

function likedMovieList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if (item) {
        movies = item;
    } else {
        movies = {};
    }
    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMovieList();
    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }    
    localStorage.setItem('liked_movies', JSON.stringify(likedMovies));
    if (location.hash == ''){
        getLikedMovies();
        getAndAppendMovies('trending/movie/day', genericSection);
  }
}

async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    printCategories(categoriesPreviewList, categories);
}
async function getAndAppendMovies(path, parentSection, optionalConfig = {}, {lazyLoad = true, clean = true} = {}) {
    const {data} = await api(path, optionalConfig);
    const movies = data.results;
    maxPages = data.total_pages;

    if (movies.length === 0) {
        parentSection.innerHTML = '';
        const movieContainer = document.createElement('h3');
        movieContainer.textContent += 'No se encontró ningún resultado';
        parentSection.appendChild(movieContainer);
        return;
    }
    
    printMovies(movies, parentSection, {lazyLoad, clean});
}

async function scrollTrending() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 60);
    if (scrollIsBottom && (currentPage < maxPages)) {
        getAndAppendMovies('trending/movie/day', genericSection, {params: {page: currentPage}}, {lazyLoad: true, clean: false});
        currentPage++;     
    }
} 
async function scrollGenre() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 60);
    if (scrollIsBottom) {
        getAndAppendMovies('discover/movie', genericSection, {params: {page: currentPage, with_genres: genre_id}}, {lazyLoad: true, clean: false});
        currentPage++;       
    }
}
async function scrollSearchPage() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 30);
    if (scrollIsBottom && (currentPage <= maxPages)) {
        getAndAppendMovies('search/movie', genericSection, {params: {page: currentPage, query: searchValue}}, {lazyLoad: true, clean: false});
        currentPage++;       
    } else if ((currentPage === maxPages)) {
        const movieContainer = document.createElement('h3');
        movieContainer.textContent += 'No se encontró más ningún resultado';
        genericSection.appendChild(movieContainer);
        window.removeEventListener('scroll', scrollFn, {passive: false});
    }
}

async function getMovieDetails(movie_id) {
    const {data} = await api('movie/' + movie_id);

    headerSection.style.background = `
        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17% 
        ),
        url('https://image.tmdb.org/t/p/w500/${data.poster_path}')
    `;
    
    movieDetailTitle.textContent = data.title;
    movieDetailDescription.textContent = data.overview;
    movieDetailScore.textContent = data.vote_average;

    printCategories(movieDetailCategoriesList, data.genres);
}

// utils
const lazyLoader = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    });
});
function printCategories(parent, categories) {
    parent.innerHTML = '';
    categories.forEach(category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + category.id);
        categoryTitle.innerHTML = category.name;
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        });
    
        categoryContainer.appendChild(categoryTitle);
        parent.appendChild(categoryContainer);
    });  
}
function printMovies(movies, parent, {lazyLoad = true, clean = true} = {}) {
    if (clean) {
        parent.innerHTML = '';
    }
    movies.forEach(movie => {
        if (movie.poster_path !== null) {
            const movieContainer = document.createElement('div');
            movieContainer.classList.add('movie-container');
    
            const movieImg = document.createElement('img');
            movieImg.classList.add('movie-img');
            movieImg.setAttribute('alt', movie.title);
            movieImg.setAttribute(
                lazyLoad ? 'data-img' : 'src', 
                'https://image.tmdb.org/t/p/w300/' + movie.poster_path
            );
            movieImg.addEventListener('click', () => {
                location.hash = '#movie=' + movie.id;
            });

            const movieBtn = document.createElement('button');
            movieBtn.classList.add('movie-btn');
            likedMovieList()[movie.id] && movieBtn.classList.add('movie-btn--liked');
            movieBtn.addEventListener('click', ()=>{
                movieBtn.classList.toggle('movie-btn--liked');
                likeMovie(movie);
            });
    
            if (lazyLoad) {
                lazyLoader.observe(movieImg);
            }
    
            movieContainer.appendChild(movieImg);
            movieContainer.appendChild(movieBtn);
            parent.appendChild(movieContainer);
        }
    });
}
function getLikedMovies() {
    const likedMovies = likedMovieList();
    const favMoviesArray = Object.values(likedMovies);
    printMovies(favMoviesArray, favouriteMoviesContainer, {lazyLoad: true, clean: true});
}