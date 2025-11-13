import { turnos_disponibles, STORAGE_KEY } from './turnos.js';

let logeado = sessionStorage.getItem("usuarioLogeado");

if(logeado === "admin"){
    alert("Bienvenido admin");
} else {
    alert("Lo sentimos, no posee privilegios para acceder a esta sección");
    window.location.href = "login.html";
}

// Estado local
let turnos = [];
let editingId = null;

// DOM
const formulario = document.getElementById('formularioTurnos');
const tbody = document.getElementById('turnos-tbody');
const btnCancelar = document.getElementById('btnCancelar');

function init() {
    cargarTurnos();
    mostrarTabla();
    bindEvents();
}

function cargarTurnos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            turnos = JSON.parse(raw);
        } catch (e) {
            console.error('Error parseando turnos desde localStorage:', e);
            turnos = turnos_disponibles.slice();
            guardarTurnos();
        }
    } else {
        // primer ingreso: inicializa con los datos base
        turnos = turnos_disponibles.slice();
        guardarTurnos();
    }
}

function guardarTurnos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turnos));
}

function mostrarTabla() {
    // limpia la tabla
    tbody.innerHTML = '';

    if (!turnos || turnos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" class="text-center">No hay turnos disponibles</td>`;
        tbody.appendChild(tr);
        return;
    }

    turnos.forEach((t) => {

        const tr = document.createElement('tr');

        tr.innerHTML = `
                <td>${escapeHtml(t.medico || '')}</td>
                <td>${escapeHtml(t.disponible || '')}</td> 
                <td>${escapeHtml(t.fecha || '')}</td>
                <td>${escapeHtml(t.hora || '')}</td>
                <td>${escapeHtml(t.especialidad || '')}</td>
                <td>${escapeHtml(t.obraSocial || '')}</td>
                <td>
                    <button class="btn btn-sm btn-primary editar-btn" data-id="${t.id}">Editar</button>
                    <button class="btn btn-sm btn-danger eliminar-btn" data-id="${t.id}">Eliminar</button>
                </td>
            `;
        tbody.appendChild(tr);
    });

    // agrega eventos dinámicos
    tbody.querySelectorAll('.editar-btn').forEach(b => b.addEventListener('click', onEditar));
    tbody.querySelectorAll('.eliminar-btn').forEach(b => b.addEventListener('click', onEliminar));
}

function onEditar(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    const t = turnos.find(x => x.id === id);
    if (!t) return;

    // llena el formulario con los datos
    editingId = id;
    document.getElementById('turnosId').value = id;
    document.getElementById('nombreTurno').value = t.medico || '';
    document.getElementById('fechaTurno').value = t.fecha || '';
    document.getElementById('horarioTurno').value = t.hora || '';
    document.getElementById('especialidadTurno').value = t.especialidad || '';
    document.getElementById('obrasocialTurno').value = t.obraSocial || '';

    document.getElementById('nombreAlta').scrollIntoView({ behavior: 'smooth' });
}

function onEliminar(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    if (!confirm('¿Eliminar este turno? Esta acción no se puede deshacer.')) return;
    turnos = turnos.filter(x => x.id !== id);
    guardarTurnos();
    mostrarTabla();
}

function bindEvents() {
    if (formulario) {
        formulario.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const idHidden = document.getElementById('turnosId').value;
            if (idHidden) {
                actualizarTurnos(parseInt(idHidden, 10));
            } else {
                agregarTurno();
            }
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            resetForm();
        });
    }
}

// creación
function generarId() {
    const max = turnos.reduce((acc, x) => (x.id > acc ? x.id : acc), 100);
    return max + 1;
}

function agregarTurno() {
    const medico = document.getElementById('nombreTurno').value.trim();
    const fecha = document.getElementById('fechaTurno').value.trim();
    const horario = document.getElementById('horarioTurno').value.trim();
    const especialidad = document.getElementById('especialidadTurno').value.trim();
    const obraSocial = document.getElementById('obrasocialTurno').value.trim();

    // validación
    if (!fecha || !especialidad) {
        alert('Por favor complete los campos obligatorios: Fecha y Especialidad.');
        return;
    }

    const nuevo = {
        id: generarId(),
        medico, 
        disponible: "Disponible",
        fecha,
        hora: horario,
        especialidad,
        obraSocial,
    };

    turnos.push(nuevo);
    guardarTurnos();
    mostrarTabla();
    resetForm();
}

// actualización
async function actualizarTurnos(id) {
    const index = turnos.findIndex(x => x.id === id);
    if (index === -1) return alert('No se encontró el turno a actualizar.');

    const medico = document.getElementById('nombreTurno').value.trim();
    const fecha = document.getElementById('fechaTurno').value.trim();
    const horario = document.getElementById('horarioTurno').value.trim();
    const especialidad = document.getElementById('especialidadTurno').value.trim();
    const obraSocial = document.getElementById('obrasocialTurno').value.trim();

    if (!fecha || !especialidad) {
        alert('Por favor complete los campos obligatorios: Fecha y Especialidad.');
        return;
    }

    turnos[index] = {
        ...turnos[index],
        medico, 
        disponible: "Diponible",
        fecha,
        hora: horario,
        especialidad,
        obraSocial,
    };

    guardarTurnos();
    mostrarTabla();
    resetForm();
}

function resetForm() {
    formulario.reset();
    editingId = null;
    document.getElementById('turnosId').value = '';
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
