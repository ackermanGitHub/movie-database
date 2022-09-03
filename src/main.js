const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    params: {
        'api_key': API_KEY,
    },
});

async function getCategoriesPreview() {
    const {data} = await api('genre/movie/list');
    const categories = data.genres;

    printCategories(categoriesPreviewList, categories);
}

async function getAndAppendMovies(path, parentSection, optionalConfig = {}) {
    const {data} = await api(path, optionalConfig);
    const movies = data.results;

    parentSection.innerHTML = '';
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            'src', 
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path
        );
    
        movieContainer.appendChild(movieImg);
        parentSection.appendChild(movieContainer);

        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        })
    });
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