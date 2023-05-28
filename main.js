const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#searchInput");
const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const prevPageButton = document.querySelector("#prevPage");
const nextPageButton = document.querySelector("#nextPage");
let URL = "https://pokeapi.co/api/v2/pokemon/";

let currentPage = 1;
const pokemonPerPage = 9;

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = searchInput.value.trim().toLowerCase();
  if (searchTerm !== "") {
    searchPokemon(searchTerm);
  }
});

function searchPokemon(searchTerm) {
  listaPokemon.innerHTML = "";

  fetch(URL + searchTerm)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("No se encontró ningún Pokémon.");
      }
    })
    .then((data) => {
      mostrarPokemon(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

function fetchPokemonList(page) {
  const offset = (page - 1) * pokemonPerPage;
  const limit = pokemonPerPage;

  fetch(`${URL}?offset=${offset}&limit=${limit}`)
    .then((response) => response.json())
    .then((data) => {
      data.results.forEach((result) => {
        fetch(result.url)
          .then((response) => response.json())
          .then((data) => {
            mostrarPokemon(data);
          });
      });
    });
}

function mostrarPokemon(poke) {
  let tipos = poke.types.map(
    (type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`
  );
  tipos = tipos.join("");

  let pokeId = poke.id.toString();
  if (pokeId.length === 1) {
    pokeId = "00" + pokeId;
  } else if (pokeId.length === 2) {
    pokeId = "0" + pokeId;
  }

  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
  listaPokemon.append(div);
}

botonesHeader.forEach((boton) =>
  boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";
    currentPage = 1;

    fetchPokemonList(currentPage, botonId);
  })
);

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    listaPokemon.innerHTML = "";
    fetchPokemonList(currentPage);
  }
});

nextPageButton.addEventListener("click", () => {
  currentPage++;
  listaPokemon.innerHTML = "";
  fetchPokemonList(currentPage);
});

fetchPokemonList(currentPage);
