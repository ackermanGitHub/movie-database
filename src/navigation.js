let currentPage = 1;
let maxPages;
let scrollFn;
let genre_id;
let searchValue;

searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
});
trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
});
arrowBtn.addEventListener('click', () => {
    location.hash = window.history.back();
});

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', scrollFn, {passive: false});

function navigator() {
    if (scrollFn) {
        window.removeEventListener('scroll', scrollFn, {passive: false});
        scrollFn = undefined;
        currentPage = 2;
    }

    if (location.hash.startsWith('#trends'))
        trendsPage();
    else if (location.hash.startsWith('#search='))
        searchPage();
    else if (location.hash.startsWith('#movie='))
        movieDetailsPage();
    else if (location.hash.startsWith('#category='))
        categoriesPage();
    else
        homePage();

    smoothscroll()
        
    if (scrollFn) {
        window.addEventListener('scroll', scrollFn, {passive: false});
    }
}

function smoothscroll(){
    
}

function homePage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    favouriteSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getAndAppendMovies('trending/movie/week', trendingMoviesPreviewList);
    getCategoriesPreview();
}
function categoriesPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');    
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    favouriteSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('='); // ['#category', 'id-name']
    const [categoryId, categoryName] = categoryData.split('-');

    headerCategoryTitle.innerHTML = decodeURIComponent(categoryName);
    scrollFn = scrollGenre;
    getAndAppendMovies('discover/movie', genericSection, {
        params: {
            with_genres: categoryId,
        },
    });
    genre_id = categoryId;
}
function movieDetailsPage() {
    headerSection.classList.add('header-container--long');
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');    
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    favouriteSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movie_id] = location.hash.split('='); // ['#movie', '234567']
    getMovieDetails(movie_id);
    getAndAppendMovies(`movie/${movie_id}/similar`, relatedMoviesContainer);
}
function searchPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');    
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    favouriteSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');
    scrollFn = scrollSearchPage;
    searchValue = query;
    getAndAppendMovies('search/movie', genericSection, {
        params: {
            query,
        },
    }, {clean: true});
}
function trendsPage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');    
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');
    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    favouriteSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');
    
    headerCategoryTitle.innerHTML = 'Tendencias';
    scrollFn = scrollTrending;
    getAndAppendMovies('trending/movie/day', genericSection, {}, {clean: true});
}
