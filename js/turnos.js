// Crud de turnos

import {
    STORAGE_KEY_MEDICOS,
    STORAGE_KEY_ESPECIALIDADES,
    STORAGE_KEY_OBRAS
} from "./medicosData.js";

import { STORAGE_KEY_TURNOS } from "./turnosData.js"; // lo creamos abajo

let turnos = [];
let medicos = [];


const tbodyTurnos = document.getElementById("tbodyTurnos");
const formTurno = document.getElementById("formTurno");

const inputId = document.getElementById("turnoId");
const inputMedico = document.getElementById("turnoMedico");
const inputFecha = document.getElementById("turnoFecha");
const inputHora = document.getElementById("turnoHora");
const btnCancelar = document.getElementById("cancelarTurno");

init();


function init() {
    cargarMedicos();
    cargarTurnos();
    llenarSelectMedicos();
    mostrarTabla();

    formTurno.addEventListener("submit", guardarTurno);
    btnCancelar.addEventListener("click", resetForm);
}

// localStorage
function cargarMedicos() {
    const raw = localStorage.getItem(STORAGE_KEY_MEDICOS);
    if (raw) medicos = JSON.parse(raw);
}

function cargarTurnos() {
    const raw = localStorage.getItem(STORAGE_KEY_TURNOS);
    if (raw) {
        turnos = JSON.parse(raw);
    } else {
        turnos = [];
        guardarTurnos();
    }
}

function guardarTurnos() {
    localStorage.setItem(STORAGE_KEY_TURNOS, JSON.stringify(turnos));
}

// muestra seleccion de medicos
function llenarSelectMedicos() {
    medicos.forEach(m => {
        const option = document.createElement("option");
        option.value = m.id;
        option.textContent = `${m.apellido}, ${m.nombre}`;
        inputMedico.appendChild(option);
    });
}

// Tabla de turnos
function mostrarTabla() {
    tbodyTurnos.innerHTML = "";

    if (turnos.length === 0) {
        tbodyTurnos.innerHTML = `
            <tr><td colspan="6" class="text-center">No hay turnos registrados</td></tr>
        `;
        return;
    }

    turnos.forEach(t => {
        const medico = medicos.find(m => m.id === t.medicoId);
        const nombreMedico = medico ? `${medico.apellido}, ${medico.nombre}` : "—";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${t.id}</td>
            <td>${nombreMedico}</td>
            <td>${t.fecha}</td>
            <td>${t.hora}</td>
            <td>${t.disponible ? "Sí" : "No"}</td>
            <td>
                <button class="btn btn-sm btn-primary editar" data-id="${t.id}">Editar</button>
                <button class="btn btn-sm btn-danger borrar" data-id="${t.id}">Eliminar</button>
            </td>
        `;
        tbodyTurnos.appendChild(tr);
    });

    tbodyTurnos.querySelectorAll(".editar").forEach(btn =>
        btn.addEventListener("click", editarTurno)
    );
    tbodyTurnos.querySelectorAll(".borrar").forEach(btn =>
        btn.addEventListener("click", borrarTurno)
    );
}


// Crud turnos

function guardarTurno(e) {
    e.preventDefault();

    const medicoId = Number(inputMedico.value);
    const fecha = inputFecha.value;
    const hora = inputHora.value;

    if (!medicoId || !fecha || !hora) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // validacion basica: evita turnos duplicados para mismo médico
    const duplicado = turnos.some(
        t =>
            t.medicoId === medicoId &&
            t.fecha === fecha &&
            t.hora === hora &&
            t.id !== Number(inputId.value)
    );

    if (duplicado) {
        alert("Ya existe un turno para ese médico en esa fecha y hora.");
        return;
    }

    if (inputId.value) {
        // edita
        const id = Number(inputId.value);
        const index = turnos.findIndex(t => t.id === id);

        turnos[index].medicoId = medicoId;
        turnos[index].fecha = fecha;
        turnos[index].hora = hora;

    } else {
        // nuevo turno
        turnos.push({
            id: generarId(),
            medicoId,
            fecha,
            hora,
            disponible: true
        });
    }

    guardarTurnos();
    mostrarTabla();
    resetForm();
}

function editarTurno(e) {
    const id = Number(e.target.dataset.id);
    const turno = turnos.find(t => t.id === id);

    inputId.value = turno.id;
    inputMedico.value = turno.medicoId;
    inputFecha.value = turno.fecha;
    inputHora.value = turno.hora;
}

function borrarTurno(e) {
    const id = Number(e.target.dataset.id);

    if (!confirm("¿Eliminar turno?")) return;

    turnos = turnos.filter(t => t.id !== id);
    guardarTurnos();
    mostrarTabla();
}

function resetForm() {
    formTurno.reset();
    inputId.value = "";
}

function generarId() {
    return turnos.length ? Math.max(...turnos.map(t => t.id)) + 1 : 1;
}
