const apiKey = "0c20173ccf3822bd517109b46896fda8";
const URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=1`;
const imgURL = "https://image.tmdb.org/t/p/w1280";
const searchForm = document.querySelector(".search");
const query = document.getElementById("query");
const root = document.getElementById("root");
let movies = [],
  page = 1,
  inSearchPage = false;

async function fetchData(URL) {
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return null;
  }
}

const fetchAndShowResults = async (URL) => {
  const data = await fetchData(URL);
  if (data) showResults(data.results);
};

const getSpecificationPage = (page) => {
  const URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=${page}`;
  fetchAndShowResults(URL);
};

const movieCard = (movie) => `
  <div class="col">
    <div class="card">
      <a class="card-media" href="${movie.poster_path}" target="_blank">
        <img src="${movie.poster_path}" alt="${movie.original_title}" width="100%" />
      </a>
      <div class="card-content">
        <div class="card-cont-header">
          <div class="cont-left">
            <h3 style="font-weight: 600">${movie.original_title}</h3>
            <span style="color: #12efec">${movie.release_date}</span>
          </div>
        </div>
        <div class="describe">${movie.overview}</div>
      </div>
    </div>
  </div>
`;

const showResults = (items) => {
  let content = !inSearchPage ? root.innerHTML : "";
  if (items && items.length > 0) {
    items.forEach((item) => {
      const { poster_path, original_title, release_date, overview } = item;
      const movieItem = {
        poster_path: poster_path ? imgURL + poster_path : "./img-01.jpeg",
        original_title:
          original_title.length > 15
            ? original_title.slice(0, 15) + "..."
            : original_title,
        release_date: release_date || "No release date",
        overview: overview || "No overview yet...",
      };
      content += movieCard(movieItem);
    });
  } else {
    content += "<p>No results found.</p>";
  }
  root.innerHTML = content;
};

const handleLoadMore = () => {
  getSpecificationPage(++page);
};

const detectEndAndLoadMore = () => {
  const el = document.documentElement;
  if (!inSearchPage && el.scrollTop + el.clientHeight >= el.scrollHeight) {
    handleLoadMore();
  }
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  inSearchPage = true;
  const searchTerm = query.value.trim();
  if (searchTerm) {
    const searchURL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
      searchTerm
    )}`;
    fetchAndShowResults(searchURL);
    query.value = "";
  }
});

window.addEventListener("scroll", detectEndAndLoadMore);

function init() {
  inSearchPage = false;
  fetchAndShowResults(URL);
}
init();
