const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" id="pokemon-${pokemon.id}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
            .map((type) => `<li class="type ${type}">${type}</li>`)
            .join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function getMoreDetails(pokeDetail) {
    return `
        <div class="pokemon-detail">
        <img src="${pokeDetail.sprites.other.dream_world.front_default}"
        alt="${pokeDetail.name}">
        <section class="details-list">
            <li>Name: ${pokeDetail.name}</li>
            <li>Height: ${pokeDetail.height}</li>
            <ul>
            Abilities:
                ${pokeDetail.abilities
            .map((ability) => `<li><span>${ability.ability.name}</li>`)
            .join('')}
            </ul>
            <ul>
            Types:
                ${pokeDetail.types
            .map((type) => `<li><span>${type.type.name}</li>`)
            .join('')}
            </ul>
            <ul>
            Stats:
                ${pokeDetail.stats
            .map((stat) => `<li><span>${stat.stat.name}: ${stat.base_stat}</li>`)
            .join('')}
            </ul>
        </section>
        </div>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

        // Adicione event listeners de clique aos elementos recém-renderizados
        const pokemonElements = document.querySelectorAll('.pokemon');
        pokemonElements.forEach((element, index) => {
            element.addEventListener('click', async () => {
                const alreadyHasDetails = document.querySelector('.pokemon-detail');
                console.log(alreadyHasDetails);
                if (alreadyHasDetails) {
                    return element.removeChild(alreadyHasDetails);
                }
                const id = Number(element.children[0].innerHTML.slice(1));
                const pokemonData = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${id}/`
                );
                const details = await pokemonData.json();
                const pokemon = getMoreDetails(details);
                const pokemonDetailsPage = document.createElement('div');
                pokemonDetailsPage.classList.add('pokemon-detail');
                element.appendChild(pokemonDetailsPage);
                pokemonDetailsPage.innerHTML = pokemon;
            });
        });
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
