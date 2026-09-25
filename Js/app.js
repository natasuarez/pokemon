// Asignación de eventos
document.getElementById('apiBtn').addEventListener('click', cargarREST);
document.getElementById('pokemonBtn').addEventListener('click', buscarPokemon);

// 1. Cargar REST (API Picsum)
function cargarREST(e) {
    e.preventDefault();
    fetch('https://picsum.photos/list')
        .then(function(res) {
            return res.json();
        })
        .then(function(imagenes) {
            let html = '<ul>';
            imagenes.slice(0, 10).forEach(function(imagen) {
                html += `
                    <li>
                        <a target="_blank" href="${imagen.post_url}">Ver Imagen</a> - Autor: ${imagen.author}
                    </li>
                `;
            });
            html += '</ul>';
            document.getElementById('resultado').innerHTML = html;
        })
        .catch(function(error) {
            console.log(error);
        });
}

// 2. Buscar Pokémon (PokeAPI con async / await y try / catch)
async function buscarPokemon(e) {
    // Detener el comportamiento por defecto de la etiqueta
    e.preventDefault();

    // Obtener valor, aplicar .trim() y .toLowerCase()
    const input = document.getElementById('pokemonInput');
    const nombrePokemon = input.value.trim().toLowerCase();

    // Validación de entradas
    if (nombrePokemon === '') {
        document.getElementById('resultado').innerHTML = `
            <p class="error-msg">Por favor escribe el nombre o número de un Pokémon.</p>
        `;
        return;
    }

    // Manejo de Errores y Excepciones con try / catch
    try {
        // Consumo asíncrono con await fetch y Template Literals
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);

        // Validar propiedad respuesta.ok (status 404)
        if (!respuesta.ok) {
            throw new Error('El Pokémon buscado no fue encontrado.');
        }

        // Convertir respuesta a JSON
        const pokemon = await respuesta.json();

        // Extraer y formatear tipos del Pokémon
        let tiposHTML = '';
        pokemon.types.forEach(function(item) {
            tiposHTML += `<span class="type-badge">${item.type.name}</span>`;
        });

        // Inyectar tarjeta en el DOM (#resultado)
        document.getElementById('resultado').innerHTML = `
            <div class="pokemon-card">
                <h2>${pokemon.name.toUpperCase()} (#${pokemon.id})</h2>
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <div class="types">${tiposHTML}</div>
                <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
            </div>
        `;

    } catch (error) {
        // Capturar fallo y renderizar mensaje en pantalla
        document.getElementById('resultado').innerHTML = `
            <p class="error-msg">${error.message}</p>
        `;
    }
}