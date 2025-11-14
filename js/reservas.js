// Listado de Reservas (solo lectura)

import { STORAGE_KEY_RESERVAS } from "./reservasData.js";
import { STORAGE_KEY } from "./turnos.js";

let reservas = [];
let turnos = [];

const tbodyReservas = document.getElementById("tbodyReservas");

init();

//  inicialización
function init() {
    cargarDatos();
    mostrarTablaReservas();
}

// cargar datos desde localStorage
function cargarDatos() {
    reservas = cargarLS(STORAGE_KEY_RESERVAS);
    turnos = cargarLS(STORAGE_KEY);
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

// obtener turno por id
function obtenerTurno(id) {
    return turnos.find(t => t.id === id) || null;
}

// tabla
function mostrarTablaReservas() {
    tbodyReservas.innerHTML = "";

    if (!reservas || reservas.length === 0) {
        tbodyReservas.innerHTML = `
            <tr><td colspan="7" class="text-center">No hay reservas realizadas</td></tr>
        `;
        return;
    }

    reservas.forEach(r => {
        const turno = obtenerTurno(r.turnoId);

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${r.id}</td>
            <td>${r.paciente}</td>
            <td>${r.documento}</td>
            <td>${r.fecha} ${r.hora}<br><small>${r.medico}</small></td>
            <td>${r.obraSocial}</td>
            <td>${r.especialidad}</td>
            <td>$ ${r.total.toLocaleString("es-AR")}</td>
        `;

        tbodyReservas.appendChild(tr);
    });
}
