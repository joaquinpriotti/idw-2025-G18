import { STORAGE_KEY_ESPECIALIDADES, ESPECIALIDADES_DATOS_INICIALES } from './medicosData.js';

let especialidades = [];
let editingId = null;

const tbody = document.getElementById('tbodyEspecialidades');
const form = document.getElementById('formEspecialidad');
const nombre = document.getElementById('especialidadNombre');
const hiddenId = document.getElementById('especialidadId');
const cancelarBtn = document.getElementById('cancelarEspecialidad');

init();

function init() {
    cargar();
    mostrar();
    form.addEventListener('submit', guardar);
    cancelarBtn.addEventListener('click', resetForm);
}

function cargar() {
    const raw = localStorage.getItem(STORAGE_KEY_ESPECIALIDADES);
    if (raw) {
        especialidades = JSON.parse(raw);
    } else {
        especialidades = ESPECIALIDADES_DATOS_INICIALES.slice();
        guardarLS();
    }
}

function guardarLS() {
    localStorage.setItem(STORAGE_KEY_ESPECIALIDADES, JSON.stringify(especialidades));
}

function mostrar() {
    tbody.innerHTML = '';
    especialidades.forEach(e => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.id}</td>
            <td>${e.nombre}</td>
            <td>
                <button class="btn btn-sm btn-primary editar" data-id="${e.id}">Editar</button>
                <button class="btn btn-sm btn-danger borrar" data-id="${e.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.editar').forEach(btn =>
        btn.addEventListener('click', onEditar)
    );
    tbody.querySelectorAll('.borrar').forEach(btn =>
        btn.addEventListener('click', onBorrar)
    );
}

function guardar(ev) {
    ev.preventDefault();

    if (editingId) {
        const i = especialidades.findIndex(e => e.id == editingId);
        especialidades[i].nombre = nombre.value.trim();
    } else {
        const nuevo = {
            id: generarId(),
            nombre: nombre.value.trim()
        };
        especialidades.push(nuevo);
    }

    guardarLS();
    mostrar();
    resetForm();
}

function generarId() {
    return Math.max(0, ...especialidades.map(e => e.id)) + 1;
}

function onEditar(e) {
    editingId = e.target.dataset.id;
    const esp = especialidades.find(x => x.id == editingId);
    nombre.value = esp.nombre;
    hiddenId.value = esp.id;
}

function onBorrar(e) {
    const id = Number(e.target.dataset.id);
    if (!confirm("¿Eliminar especialidad?")) return;
    especialidades = especialidades.filter(e => e.id !== id);
    guardarLS();
    mostrar();
}

function resetForm() {
    editingId = null;
    form.reset();
    hiddenId.value = '';
}
