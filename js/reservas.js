// Listado de Reservas (solo lectura)

import {
    STORAGE_KEY_MEDICOS,
    STORAGE_KEY_ESPECIALIDADES,
    STORAGE_KEY_OBRAS
} from "./medicosData.js";

import { STORAGE_KEY_TURNOS } from "./turnosData.js";
import { STORAGE_KEY_RESERVAS } from "./reservasData.js";

let reservas = [];
let medicos = [];
let especialidades = [];
let obrasSociales = [];
let turnos = [];

const tbodyReservas = document.getElementById("tbodyReservas");

init();


function init() {
    cargarDatos();
    mostrarTablaReservas();
}

// carga los datos
function cargarDatos() {
    reservas = cargarLS(STORAGE_KEY_RESERVAS);
    medicos = cargarLS(STORAGE_KEY_MEDICOS);
    especialidades = cargarLS(STORAGE_KEY_ESPECIALIDADES);
    obrasSociales = cargarLS(STORAGE_KEY_OBRAS);
    turnos = cargarLS(STORAGE_KEY_TURNOS);
}

function cargarLS(clave) {
    const raw = localStorage.getItem(clave);
    if (!raw) return [];
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}


function obtenerMedico(id) {
    return medicos.find(m => m.id === id) || null;
}

function obtenerEspecialidad(id) {
    return especialidades.find(e => e.id === id) || null;
}

function obtenerObra(id) {
    return obrasSociales.find(o => o.id === id) || null;
}

function obtenerTurno(id) {
    return turnos.find(t => t.id === id) || null;
}

// tabla de reservas
function mostrarTablaReservas() {
    tbodyReservas.innerHTML = "";

    if (reservas.length === 0) {
        tbodyReservas.innerHTML = `
            <tr><td colspan="7" class="text-center">No hay reservas realizadas</td></tr>
        `;
        return;
    }

    reservas.forEach(r => {
        const turno = obtenerTurno(r.turnoId);
        const medico = turno ? obtenerMedico(turno.medicoId) : null;
        const especialidad = obtenerEspecialidad(r.especialidadId);
        const obra = obtenerObra(r.obraSocialId);

        const medicoNombre = medico ? `${medico.apellido}, ${medico.nombre}` : "—";
        const turnoTexto = turno ? `${turno.fecha} ${turno.hora}` : "—";
        const especialidadNombre = especialidad ? especialidad.nombre : "—";
        const obraNombre = obra ? obra.nombre : "—";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.paciente}</td>
            <td>${r.documento}</td>
            <td>${turnoTexto}<br><small>${medicoNombre}</small></td>
            <td>${obraNombre}</td>
            <td>${especialidadNombre}</td>
            <td>$ ${r.total.toLocaleString("es-AR")}</td>
        `;
        tbodyReservas.appendChild(tr);
    });
}
