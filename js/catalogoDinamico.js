import { MEDICO_DATOS_INICIALES, STORAGE_KEY } from './medicosData.js';

// Estado local
let medicos = [];
let editingId = null;

// DOM
const catalogo = document.getElementById('catalogo-Medicos');

function init() {
    cargarMedicos();
    mostrarCatalogo();
}

function cargarMedicos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            medicos = JSON.parse(raw);
        } catch (e) {
            console.error('Error parseando médicos desde localStorage:', e);
            medicos = MEDICO_DATOS_INICIALES.slice();
            guardarMedicos();
        }
    } else {
        // primer ingreso: inicializa con los datos base
        medicos = MEDICO_DATOS_INICIALES.slice();
        guardarMedicos();
    }
}

function guardarMedicos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicos));
}

function mostrarCatalogo() {
    // limpia la tabla
    catalogo.innerHTML = '';

    if (!medicos || medicos.length === 0) {
        catalogo.classList.replace("row", "d-flex");
        catalogo.classList.replace("g-4", "justify-content-center");
        const div = document.createElement('div');
        div.classList.add("col-12");
        div.classList.add("col-sm-6");
        div.classList.add("col-lg-4");
        div.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="img/Doctor sin foto.jpg" class="card-img-top">
                    <div class="card-body text-center">
                        <h5 class="card-title"> Aún no contamos con médicos</h5>
                        <p class="card-text">Si queres formar parte de nuestro equipo</p>
                        <div class="mt-3">
                                <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#modal1">
                                    Contactanos
                                </button>
                            </div>
                    </div>
                </div>
        `;
        catalogo.appendChild(div);
        return;
    }

    medicos.forEach((m) => {
        const div = document.createElement('div');
        div.classList.add("col-12");
        div.classList.add("col-sm-6");
        div.classList.add("col-lg-4");
        div.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${escapeHtml(m.imagen || "img/Doctor sin foto.jpg")}" class="card-img-top">
                    <div class="card-body text-center">
                        <h5 class="card-title">${escapeHtml(m.nombre || '')}</h5>
                        <p class="card-text">${escapeHtml(m.especialidad || '')}</p>
                        <span class="badge bg-primary">${escapeHtml(m.obraSocial || '')}</span>
                    </div>
                </div>
        `;

        catalogo.appendChild(div);
    });
}

function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

init();