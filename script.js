const API_KEY = '9a372670de0b8e14a5b0bdedc33c7376';
const BASE_URL = 'https://api.themoviedb.org/3';

const movieContainer = document.querySelector('.movies');
const searchInput = document.querySelector('.search-box input');
const searchButton = document.querySelector('.search-box button');

// Функция для показа фильмов
function showMovies(movies) {
  movieContainer.innerHTML = '';
  movies.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('movie-card');
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
    `;
    movieContainer.appendChild(div);
  });
}

// Загрузка популярных фильмов при старте
fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`)
  .then(res => res.json())
  .then(data => showMovies(data.results));

// Поиск по названию фильма
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.results.length > 0) {
          showMovies(data.results);
        } else {
          movieContainer.innerHTML = '<p>No movies found 😢</p>';
        }
      })
      .catch(err => console.error(err));
  }
});
