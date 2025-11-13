// Gestión de la carga de datos y muestra dinámicamente el catálogo de médicos en el HTML.

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

// Referencia al contenedor del catálogo en el HTML
const catalogo = document.getElementById('catalogo-Medicos');

// -----------------------------------------------------
// Función principal de inicialización
function init() {
    cargarEspecialidades();
    cargarObrasSociales();
    cargarMedicos();
    mostrarCatalogo();
}

// ----------------------------------------
// Funciones de carga y guardado en localStorage

// Carga las especialidades desde localStorage o usa las iniciales
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

// Guarda las especialidades en localStorage
function guardarEspecialidades() {
    localStorage.setItem(STORAGE_KEY_ESPECIALIDADES, JSON.stringify(especialidades));
}

// Carga las obras sociales desde localStorage o usa las iniciales
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

// Guarda las obras sociales en localStorage
function guardarObrasSociales() {
    localStorage.setItem(STORAGE_KEY_OBRAS, JSON.stringify(obrasSociales));
}

// Carga los médicos desde localStorage o usa los iniciales
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

// Guarda los médicos en localStorage
function guardarMedicos() {
    localStorage.setItem(STORAGE_KEY_MEDICOS, JSON.stringify(medicos));
}

// Funciones auxiliares

// Devuelve el nombre de la especialidad dado su ID
function obtenerNombreEspecialidad(id) {
    const esp = especialidades.find(e => e.id === id);
    return esp ? esp.nombre : '';
}

// Devuelve el nombre de la primera obra social (si existe)
function obtenerNombrePrimeraObra(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return 'Particular';
    const obra = obrasSociales.find(o => ids.includes(o.id));
    return obra ? obra.nombre : 'Particular';
}

// Evita inyecciones XSS reemplazando caracteres peligrosos
function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function mostrarCatalogo() {
    if (!catalogo) return;
    catalogo.innerHTML = '';

    // Si no hay médicos cargados, muestra un mensaje por defecto
    if (!medicos || medicos.length === 0) {
        catalogo.classList.replace("row", "d-flex");
        catalogo.classList.replace("g-4", "justify-content-center");

        const div = document.createElement('div');
        div.classList.add("col-12", "col-sm-6", "col-lg-4");
        div.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="img/Doctor sin foto.jpg" class="card-img-top" alt="Sin médicos">
                <div class="card-body text-center">
                    <h5 class="card-title">Aún no contamos con médicos</h5>
                    <p class="card-text">Si querés formar parte de nuestro equipo</p>
                    <div class="mt-3">
                        <button class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#modal1">
                            Contactanos
                        </button>
                    </div>
                </div>
            </div>
        `;
        catalogo.appendChild(div);
        return;
    }

    // Si hay médicos, genera una card por cada uno
    medicos.forEach((m) => {
        const div = document.createElement('div');
        div.classList.add("col-12", "col-sm-6", "col-lg-4");

        const especialidadNombre = obtenerNombreEspecialidad(m.especialidadId);
        const obraPrincipal = obtenerNombrePrimeraObra(m.obrasSocialesIds);
        const imagenSrc = m.imagen || "img/Doctor sin foto.jpg";

        div.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="${escapeHtml(m.imagen || "img/Doctor sin foto.jpg")}" class="card-img-top">
                    <div class="card-body text-center">
                        <h5 class="card-title">${escapeHtml(m.nombre || '')}</h5>
                        <p class="card-text">${escapeHtml(m.especialidad || '')}</p>
                        <span class="badge bg-primary">${escapeHtml(m.obraSocial || '')}</span>
                    </div>
                    <div class="card-body text-center">
                        <button 
                            class="btn btn-outline-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#medicoModal"
                            data-nombre="${escapeHtml(m.nombre)}"
                            data-dni="${escapeHtml(m.dni)}"
                            data-matricula="${escapeHtml(m.matricula)}"
                            data-especialidad="${escapeHtml(m.especialidad)}"
                            data-telefono="${escapeHtml(m.telefono)}"
                            data-obrasocial="${escapeHtml(m.obraSocial)}"
                            data-descripcion="${escapeHtml(m.descripcion)}"
                        >
                            Ver más
                        </button>
                        <a href="turnosCliente.html">
                            <button class="btn btn-primary">
                                Turnos
                            </button>
                        </a>
                    </div>
                    </div>
                </div>
            </div>
        `;
        catalogo.appendChild(div);
    });
}

// Configuración del modal que muestra la descripción
const medicoModal = document.getElementById('medicoModal');

medicoModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; 

    const nombre = button.getAttribute('data-nombre');
    const descripcion = button.getAttribute('data-descripcion');
    const dni = button.getAttribute('data-dni');
    const matricula = button.getAttribute('data-matricula');
    const especialidad = button.getAttribute('data-especialidad');
    const telefono = button.getAttribute('data-telefono');
    const obraSocial = button.getAttribute('data-obrasocial');

        // Inserta los datos en el contenido del modal
        const modalTitleSpan = document.getElementById('modalDescripcionTitle');
        const modalBody = document.getElementById('modalDescripcionBody');

    modalTitleSpan.textContent = nombre;
    modalBody.innerHTML = 
        `<p>DNI: ${dni} <br>
        MatrÍcula: ${matricula} <br>
        Especialidad: ${especialidad}<br>
        Telefono: ${telefono}<br>
        ObraSocial: ${obraSocial}<br><br>
        ${descripcion} </p>`;
});

init();
