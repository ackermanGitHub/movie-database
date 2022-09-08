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

async function getAndAppendMovies(path, parentSection, optionalConfig = {}, lazyLoad = false) {
    const {data} = await api(path, optionalConfig);
    const movies = data.results;

    if (movies.length === 0) {
        parentSection.innerHTML = '';
        const movieContainer = document.createElement('h3');
        movieContainer.textContent = 'No se encontró ningún resultado';
        parentSection.appendChild(movieContainer);
        return;
    }

    parentSection.innerHTML = '';
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src', 
            'https://image.tmdb.org/t/p/w500/' + movie.poster_path
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
        parentSection.appendChild(movieContainer);

        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
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

const lazyLoader = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-img');
            entry.target.setAttribute('src', url);
        }
    });
});

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

function createObserver() {
    return new IntersectionObserver( entries => {
        entries.forEach(element => {
            element.src = element.data-img;
        })
    });
}

// I Fucked Up Here
/* 

async function getAndAppendMovies(path, parentSection, optionalConfig = {}, lazyLoad = false) {
    const {data} = await api(path, optionalConfig);
    const movies = data.results;

    if (movies.length === 0) {
        parentSection.innerHTML = '';
        const movieContainer = document.createElement('h3');
        movieContainer.textContent = 'No se encontró ningún resultado';
        parentSection.appendChild(movieContainer);
        return;
    }

    parentSection.innerHTML = '';
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src', 
            'https://image.tmdb.org/t/p/w500/' + movie.poster_path
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
        parentSection.appendChild(movieContainer);

        movieContainer.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
    });
}

async function getAndAppendMovies(path, parentSection, optionalConfig = {}, lazyLoad = false, nextBtn = false, clean = true) {
    const {data} = await api(path, optionalConfig);
    const movies = data.results;

    if (movies.length === 0) {
        parentSection.innerHTML = '';
        const movieContainer = document.createElement('h3');
        movieContainer.textContent = 'No se encontró ningún resultado';
        parentSection.appendChild(movieContainer);
        return;
    }

    printMovies(parentSection, movies, lazyLoad, clean);
    if (nextBtn) {
        createNextBtn(path, parentSection)        
    }
}

function createNextBtn(path, parentSection) {
    const nextPageBtn = document.createElement('button');
    nextPageBtn.innerText = 'Next';
    nextPageBtn.addEventListener('click', () => {
        getAndAppendMovies(path, parentSection, {
            params: {
                page: 2,
            },
        }, true, true);
    });
    parentSection.appendChild(nextPageBtn);
}
function printMovies(parent, movies, lazyLoad = false, clean = false) {
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
            'https://image.tmdb.org/t/p/w500/' + movie.poster_path
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
*/