import { turnos_disponibles, STORAGE_KEY } from './turnos.js';
import { STORAGE_KEY_RESERVAS } from './reservasData.js';

// Estado local
let turnos = [];
let editingId = null;

// DOM
const formulario = document.getElementById('formularioTurnos');
const tbody = document.getElementById('turnos-tbody');
const btnCancelar = document.getElementById('btnLimpiar');

//  inicialización
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
        turnos = turnos_disponibles.slice();
        guardarTurnos();
    }
}

function guardarTurnos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(turnos));
}

// tabla
function mostrarTabla() {
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
                <button class="btn btn-sm btn-primary guardar-btn" data-id="${t.id}">Guardar turno</button>
                <button class="btn btn-sm btn-danger cancelar-btn" data-id="${t.id}">Cancelar turno</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.guardar-btn').forEach(b => b.addEventListener('click', obtenerTurno));
    tbody.querySelectorAll('.cancelar-btn').forEach(b => b.addEventListener('click', cancelarTurno));
    actualizarFiltroEspecialidades();
}

// reserva turno
function obtenerTurno(e) {
    const idTurno = parseInt(e.currentTarget.dataset.id, 10);
    const turnoSeleccionado = turnos.find(t => t.id === idTurno);

    if (!turnoSeleccionado) {
        console.error('Error: Turno no encontrado con ID:', idTurno);
        return;
    }

    if (turnoSeleccionado.disponible === "Reservado") {
        alert("El turno ya está reservado.");
        return;
    }

    const valorTurno = calcularCosto(e);

    if (!confirm(`¿Desea reservar el turno para ${turnoSeleccionado.medico} el ${turnoSeleccionado.fecha}?
Valor: $${valorTurno}`)) {
        return;
    }

    // captura de datos del paciente
    let paciente = prompt("Ingrese el nombre del paciente:", "");
    if (paciente === null) return;
    paciente = paciente.trim();
    if (!paciente) {
        alert("Debe ingresar un nombre válido.");
        return;
    }

    let documento = prompt("Ingrese el número de documento (opcional):", "");
    if (documento === null) documento = "";
    documento = documento.trim();

    // crear reserva
    let reservasArray = [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY_RESERVAS);
        reservasArray = raw ? JSON.parse(raw) : [];
    } catch {
        reservasArray = [];
    }

    const nuevaId = reservasArray.length > 0
        ? Math.max(...reservasArray.map(r => Number(r.id || 0))) + 1
        : 1;

    const nuevaReserva = {
        id: nuevaId,
        paciente: paciente,
        documento: documento || "-",
        turnoId: turnoSeleccionado.id,
        medico: turnoSeleccionado.medico,
        especialidad: turnoSeleccionado.especialidad,
        obraSocial: turnoSeleccionado.obraSocial,
        fecha: turnoSeleccionado.fecha,
        hora: turnoSeleccionado.hora || turnoSeleccionado.horario || "",
        total: valorTurno
    };

    reservasArray.push(nuevaReserva);
    localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservasArray));

    turnoSeleccionado.disponible = 'Reservado';
    guardarTurnos();
    mostrarTabla();
    resetForm();

    alert(
        `Reserva confirmada:
Paciente: ${nuevaReserva.paciente}
Médico: ${nuevaReserva.medico}
Fecha: ${nuevaReserva.fecha} - ${nuevaReserva.hora}
Obra social: ${nuevaReserva.obraSocial}
Valor final: $${valorTurno}`
    );
}

// cancela turno
function cancelarTurno(e) {
    const idTurno = parseInt(e.currentTarget.dataset.id, 10);
    const turnoSeleccionado = turnos.find(t => t.id === idTurno);

    if (!turnoSeleccionado) {
        console.error('Turno no encontrado');
        return;
    }

    if (turnoSeleccionado.disponible === "Disponible") {
        alert("El turno ya se encuentra disponible.");
        return;
    }

    if (!confirm(`¿Cancelar reserva del turno con ${turnoSeleccionado.medico}?`)) {
        return;
    }

    // Libera turno
    turnoSeleccionado.disponible = "Disponible";

    // elimina la reserva asociada
    let reservasArray = JSON.parse(localStorage.getItem(STORAGE_KEY_RESERVAS)) || [];
    reservasArray = reservasArray.filter(r => r.turnoId !== idTurno);
    localStorage.setItem(STORAGE_KEY_RESERVAS, JSON.stringify(reservasArray));

    guardarTurnos();
    mostrarTabla();
    resetForm();
}

// filtros
document.getElementById('formularioTurnos').addEventListener('submit', function (event) {
    event.preventDefault();
    filtrarTurnos();
});

function filtrarTurnos() {
    const fechaAFiltrar = document.getElementById('fechaFiltro').value;
    const especialidadAFiltrar = document.getElementById('especialidadFiltro').value;
    const obraSocialAFiltrar = document.getElementById('obrasocialFiltro').value;
    const medicoAFiltrar = document.getElementById('medicoFiltro').value;

    tbody.innerHTML = '';

    const turnosFiltrados = turnos.filter(turno => {
        return (!fechaAFiltrar || turno.fecha === fechaAFiltrar)
            && (!especialidadAFiltrar || turno.especialidad === especialidadAFiltrar)
            && (!obraSocialAFiltrar || turno.obraSocial === obraSocialAFiltrar)
            && (!medicoAFiltrar || turno.medico === medicoAFiltrar);
    });

    if (turnosFiltrados.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay turnos que coincidan.</td></tr>`;
        return;
    }

    turnosFiltrados.forEach(t => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${escapeHtml(t.medico || '')}</td>
            <td>${escapeHtml(t.disponible || '')}</td> 
            <td>${escapeHtml(t.fecha || '')}</td>
            <td>${escapeHtml(t.hora || '')}</td>
            <td>${escapeHtml(t.especialidad || '')}</td>
            <td>${escapeHtml(t.obraSocial || '')}</td>
            <td>
                <button class="btn btn-sm btn-primary guardar-btn" data-id="${t.id}">Guardar turno</button>
                <button class="btn btn-sm btn-danger cancelar-btn" data-id="${t.id}">Cancelar turno</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.guardar-btn').forEach(b => b.addEventListener('click', obtenerTurno));
    tbody.querySelectorAll('.cancelar-btn').forEach(b => b.addEventListener('click', cancelarTurno));
}

function actualizarFiltroEspecialidades() {
    const selectFiltro = document.getElementById('especialidadFiltro');

    while (selectFiltro.options.length > 1) {
        selectFiltro.remove(1);
    }

    if (!turnos || turnos.length === 0) return;

    const especialidadesUnicas = [...new Set(turnos.map(t => t.especialidad))];

    especialidadesUnicas.forEach(especialidad => {
        const opt = document.createElement('option');
        opt.value = especialidad;
        opt.textContent = especialidad;
        selectFiltro.appendChild(opt);
    });
}

// eventos
function resetForm() {
    formulario?.reset();
    editingId = null;
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

// calcular costo
function calcularCosto(e) {
    const idTurno = parseInt(e.currentTarget.dataset.id, 10);
    const turno = turnos.find(t => t.id === idTurno);

    if (!turno) return 0;

    let costo = 0;

    switch (turno.especialidad) {
        case "Cardiología": costo = 18000; break;
        case "Dermatología": costo = 20000; break;
        case "Traumatología": costo = 15000; break;
    }

    switch (turno.obraSocial) {
        case "OSDE": costo *= 0.75; break;
        case "PAMI": costo *= 0.50; break;
    }

    return costo;
}

init();
