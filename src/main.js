import {API_KEY} from "./secrets.js"

async function getTrendingMoviesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=' + API_KEY);
    const data = await res.json();

    const movies = data.results;
    const getTrendingPreviewMovieContainer = document.querySelector('#trendingPreview .trendingPreview-movieList');
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
        getTrendingPreviewMovieContainer.appendChild(movieContainer);
    });  
}

async function getCategoriesPreview() {
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=' + API_KEY);
    const data = await res.json();

    const categories = data.genres;
    const previewCategoriesContainer = document.querySelector('#categoriesPreview .categoriesPreview-list');
    categories.forEach(categories => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id', 'id' + categories.id);
        categoryTitle.innerHTML = categories.name;
    
        categoryContainer.appendChild(categoryTitle);
        previewCategoriesContainer.appendChild(categoryContainer);
    });  
}

getTrendingMoviesPreview();
getCategoriesPreview();