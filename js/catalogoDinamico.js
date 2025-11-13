
import {
    MEDICO_DATOS_INICIALES,
    ESPECIALIDADES_DATOS_INICIALES,
    OBRAS_SOCIALES_DATOS_INICIALES,
    STORAGE_KEY_MEDICOS,
    STORAGE_KEY_ESPECIALIDADES,
    STORAGE_KEY_OBRAS
} from './medicosData.js';

let medicos = [];
let especialidades = [];
let obrasSociales = [];


const catalogo = document.getElementById('catalogo-Medicos');

function init() {
    cargarEspecialidades();
    cargarObrasSociales();
    cargarMedicos();
    mostrarCatalogo();
}

// carga los datos
function cargarEspecialidades() {
    const raw = localStorage.getItem(STORAGE_KEY_ESPECIALIDADES);
    if (raw) {
        try {
            especialidades = JSON.parse(raw);
        } catch (e) {
            console.error('Error parseando especialidades desde localStorage:', e);
            especialidades = ESPECIALIDADES_DATOS_INICIALES.slice();
            guardarEspecialidades();
        }
    } else {
        especialidades = ESPECIALIDADES_DATOS_INICIALES.slice();
        guardarEspecialidades();
    }
}

function guardarEspecialidades() {
    localStorage.setItem(STORAGE_KEY_ESPECIALIDADES, JSON.stringify(especialidades));
}

function cargarObrasSociales() {
    const raw = localStorage.getItem(STORAGE_KEY_OBRAS);
    if (raw) {
        try {
            obrasSociales = JSON.parse(raw);
        } catch (e) {
            console.error('Error parseando obras sociales desde localStorage:', e);
            obrasSociales = OBRAS_SOCIALES_DATOS_INICIALES.slice();
            guardarObrasSociales();
        }
    } else {
        obrasSociales = OBRAS_SOCIALES_DATOS_INICIALES.slice();
        guardarObrasSociales();
    }
}

function guardarObrasSociales() {
    localStorage.setItem(STORAGE_KEY_OBRAS, JSON.stringify(obrasSociales));
}

function cargarMedicos() {
    const raw = localStorage.getItem(STORAGE_KEY_MEDICOS);
    if (raw) {
        try {
            medicos = JSON.parse(raw);
        } catch (e) {
            console.error('Error parseando médicos desde localStorage:', e);
            medicos = MEDICO_DATOS_INICIALES.slice();
            guardarMedicos();
        }
    } else {
        medicos = MEDICO_DATOS_INICIALES.slice();
        guardarMedicos();
    }
}

function guardarMedicos() {
    localStorage.setItem(STORAGE_KEY_MEDICOS, JSON.stringify(medicos));
}

function obtenerNombreEspecialidad(id) {
    const esp = especialidades.find(e => e.id === id);
    return esp ? esp.nombre : '';
}

function obtenerNombrePrimeraObra(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return 'Particular';
    const obra = obrasSociales.find(o => ids.includes(o.id));
    return obra ? obra.nombre : 'Particular';
}

// catalogo
function mostrarCatalogo() {
    if (!catalogo) return;

    catalogo.innerHTML = '';

    if (!medicos || medicos.length === 0) {
        catalogo.classList.replace("row", "d-flex");
        catalogo.classList.replace("g-4", "justify-content-center");
        const div = document.createElement('div');
        div.classList.add("col-12", "col-sm-6", "col-lg-4");
        div.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="img/Doctor sin foto.jpg" class="card-img-top">
                <div class="card-body text-center">
                    <h5 class="card-title"> Aún no contamos con médicos</h5>
                    <p class="card-text">Si querés formar parte de nuestro equipo podés contactarnos.</p>
                </div>
            </div>
        `;
        catalogo.appendChild(div);
        return;
    }

    medicos.forEach((m) => {
        const div = document.createElement('div');
        div.classList.add("col-12", "col-sm-6", "col-lg-4");

        const especialidadNombre = obtenerNombreEspecialidad(m.especialidadId);
        const obraPrincipal = obtenerNombrePrimeraObra(m.obrasSocialesIds);
        const imagenSrc = m.imagen || "img/Doctor sin foto.jpg";

        div.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${escapeHtml(imagenSrc)}" class="card-img-top">
                <div class="card-body text-center">
                    <h5 class="card-title">${escapeHtml(m.nombre || '')} ${escapeHtml(m.apellido || '')}</h5>
                    <p class="card-text">${escapeHtml(especialidadNombre || '')}</p>
                    <span class="badge bg-primary">${escapeHtml(obraPrincipal || '')}</span>
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
