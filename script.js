const API_KEY = '9a372670de0b8e14a5b0bdedc33c7376';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const movieContainer = document.querySelector('.movies');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

// Initialize Modal
const modalOverlay = document.createElement('div');
modalOverlay.classList.add('modal-overlay');
modalOverlay.innerHTML = `
    <div class="modal-content">
        <span class="modal-close">&times;</span>
        <img class="modal-poster" src="" alt="">
        <div class="modal-info">
            <h2></h2>
            <div class="meta">
                <span class="rating"></span>
                <span class="date"></span>
            </div>
            <p class="overview"></p>
        </div>
    </div>
`;
document.body.appendChild(modalOverlay);

const modalClose = modalOverlay.querySelector('.modal-close');
modalClose.onclick = () => modalOverlay.classList.remove('active');
window.onclick = (event) => {
    if (event.target === modalOverlay) modalOverlay.classList.remove('active');
};

// Function to show loading state
function showLoading() {
    movieContainer.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const skeleton = document.createElement('div');
        skeleton.classList.add('movie-card', 'skeleton');
        skeleton.style.height = '350px';
        movieContainer.appendChild(skeleton);
    }
}

// Function to fetch and display movies
async function fetchMovies(url) {
    showLoading();
    try {
        const res = await fetch(url);
        const data = await res.json();
        displayMovies(data.results);
    } catch (err) {
        console.error(err);
        movieContainer.innerHTML = '<p style="color: white; grid-column: 1/-1; text-align: center;">Something went wrong. Please try again later.</p>';
    }
}

// Function to render movie cards
function displayMovies(movies) {
    movieContainer.innerHTML = '';
    
    if (!movies || movies.length === 0) {
        movieContainer.innerHTML = '<p style="color: white; grid-column: 1/-1; text-align: center;">No movies found 😢</p>';
        return;
    }

    movies.forEach(movie => {
        if (!movie.poster_path) return;

        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        `;
        
        card.onclick = () => openModal(movie);
        movieContainer.appendChild(card);
    });
}

// Function to open modal with details
function openModal(movie) {
    const modalPoster = modalOverlay.querySelector('.modal-poster');
    const modalTitle = modalOverlay.querySelector('h2');
    const modalRating = modalOverlay.querySelector('.rating');
    const modalDate = modalOverlay.querySelector('.date');
    const modalOverview = modalOverlay.querySelector('.overview');

    modalPoster.src = `${IMAGE_URL}${movie.poster_path}`;
    modalTitle.textContent = movie.title;
    modalRating.textContent = `⭐ ${movie.vote_average.toFixed(1)}`;
    modalDate.textContent = `📅 ${movie.release_date}`;
    modalOverview.textContent = movie.overview;

    modalOverlay.classList.add('active');
}

// Search functionality
async function searchMovies() {
    const query = searchInput.value.trim();
    if (query) {
        // If we're not on the movies page, we should ideally redirect to Movies.html?search=query
        // But for this simple version, we'll just search on the current page if the container exists
        if (movieContainer) {
            await fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        } else {
            window.location.href = `Movies.html?search=${encodeURIComponent(query)}`;
        }
    }
}

searchButton.addEventListener('click', searchMovies);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovies();
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');

    if (searchQuery) {
        searchInput.value = searchQuery;
        fetchMovies(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchQuery}`);
    } else if (movieContainer) {
        fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
    }
});
