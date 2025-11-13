// --- Catálogo de médicos para visitantes (lee desde LocalStorage) ---

import { MEDICO_DATOS_INICIALES, STORAGE_KEY_MEDICOS as STORAGE_KEY } from './medicosData.js';

document.addEventListener("DOMContentLoaded", () => {
    inicializarLocalStorage();
    renderCatalogo();
});

function inicializarLocalStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(MEDICO_DATOS_INICIALES));
    }
}

function renderCatalogo() {
    const contenedor = document.getElementById("catalogoMedicos");
    if (!contenedor) return;

    const medicos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (!medicos.length) {
        contenedor.innerHTML = `<p class="text-center text-muted">No hay médicos registrados.</p>`;
        return;
    }

    let html = "";
    medicos.forEach((m) => {
        html += `
            <div class="col-12 col-sm-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${m.foto || 'img/default.jpg'}" class="card-img-top" alt="${m.nombre}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${m.nombre}</h5>
                        <p class="card-text text-secondary">${m.especialidad}</p>
                    </div>
                </div>
            </div>
        `;
    });

    contenedor.innerHTML = html;
}
