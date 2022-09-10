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
async function getAndAppendMovies(path, parentSection, optionalConfig = {}, {lazyLoad = true, clean = true} = {}) {
    const {data} = await api(path, optionalConfig);
    const movies = data.results;

    if (movies.length === 0) {
        parentSection.innerHTML = '';
        const movieContainer = document.createElement('h3');
        movieContainer.textContent = 'No se encontró ningún resultado';
        parentSection.appendChild(movieContainer);
        return;
    }
    
    printMovies(movies, parentSection, {lazyLoad, clean});
}
async function scrollTrending() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 30);
    if (scrollIsBottom) {
        getAndAppendMovies('trending/movie/day', genericSection, {params: {page: currentPage}}, {lazyLoad: true, clean: false});
        currentPage++;     
    }
} 
async function scrollGenre() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 30);
    if (scrollIsBottom) {
        getAndAppendMovies('discover/movie', genericSection, {params: {page: currentPage, with_genres: genre_id}}, {lazyLoad: true, clean: false});
        currentPage++;       
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
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src', 
            'https://image.tmdb.org/t/p/w300/' + movie.poster_path
        );
        movieImg.addEventListener('error', () => {
            movieImg.setAttribute(
                'src',
                'https://static.platzi.com/static/images/error/img404.png',    
            );
            setTimeout(() => {
                movieContainer.innerHTML += '<h2>Error, la imagen no arroja ningún resultado</h2>';
            }, 0);
        });

        if (lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        parent.appendChild(movieContainer);

        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
    });
}
function createNextBtn(path, parentSection, params = {}) {
    const pageSpan = document.createElement('span');
    pageSpan.innerText = 'Current Page = ' + currentPage;
    const nextPageBtn = document.createElement('button');
    nextPageBtn.innerText = 'Next';
    nextPageBtn.addEventListener('click', () => {
        parentSection.removeChild(pageSpan);
        parentSection.removeChild(nextPageBtn);
        getAndAppendMovies(path, parentSection, {
            params: {
                ...params,
                page: currentPage + 1,
            },
        }, {clean: false, nextBtn: true, currentPage: currentPage+1});
        pageSpan.innerText = 'Current Page = ' + currentPage;
    });
    parentSection.appendChild(pageSpan);
    parentSection.appendChild(nextPageBtn);
}