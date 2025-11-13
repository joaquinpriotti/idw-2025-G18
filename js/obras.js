// CRUD de obras sociales

import {
    STORAGE_KEY_OBRAS,
    OBRAS_SOCIALES_DATOS_INICIALES
} from "./medicosData.js";

let obras = [];
let editingId = null;

// DOM
const tbody = document.getElementById("tbodyObras");
const form = document.getElementById("formObra");
const inputId = document.getElementById("obraId");
const inputNombre = document.getElementById("obraNombre");
const inputDescripcion = document.getElementById("obraDescripcion");
const btnCancelar = document.getElementById("cancelarObra");

init();

function init() {
    cargarObras();
    mostrarTabla();

    form.addEventListener("submit", guardarObra);
    btnCancelar.addEventListener("click", resetForm);
}

// carga y guarda las obras

function cargarObras() {
    const raw = localStorage.getItem(STORAGE_KEY_OBRAS);

    if (raw) {
        try {
            obras = JSON.parse(raw);
        } catch {
            obras = OBRAS_SOCIALES_DATOS_INICIALES.slice();
            guardarObras();
        }
    } else {
        obras = OBRAS_SOCIALES_DATOS_INICIALES.slice();
        guardarObras();
    }
}

function guardarObras() {
    localStorage.setItem(STORAGE_KEY_OBRAS, JSON.stringify(obras));
}



function mostrarTabla() {
    tbody.innerHTML = "";

    obras.forEach((o) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${o.id}</td>
            <td>${o.nombre}</td>
            <td>${o.descripcion || "-"}</td>
            <td>
                <button class="btn btn-sm btn-primary editar" data-id="${o.id}">Editar</button>
                <button class="btn btn-sm btn-danger borrar" data-id="${o.id}">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".editar").forEach((btn) =>
        btn.addEventListener("click", editarObra)
    );
    tbody.querySelectorAll(".borrar").forEach((btn) =>
        btn.addEventListener("click", borrarObra)
    );
}

// crud

function guardarObra(event) {
    event.preventDefault();

    const nombre = inputNombre.value.trim();
    const descripcion = inputDescripcion.value.trim();

    if (!nombre) {
        alert("El nombre es obligatorio.");
        return;
    }

    if (editingId) {
        const index = obras.findIndex((o) => o.id === editingId);
        obras[index].nombre = nombre;
        obras[index].descripcion = descripcion;
    } else {
        obras.push({
            id: generarId(),
            nombre,
            descripcion
        });
    }

    guardarObras();
    mostrarTabla();
    resetForm();
}

function editarObra(e) {
    editingId = Number(e.target.dataset.id);
    const obra = obras.find((o) => o.id === editingId);

    inputId.value = obra.id;
    inputNombre.value = obra.nombre;
    inputDescripcion.value = obra.descripcion;
}

function borrarObra(e) {
    const id = Number(e.target.dataset.id);

    if (!confirm("¿Eliminar obra social?")) return;

    obras = obras.filter((o) => o.id !== id);
    guardarObras();
    mostrarTabla();
}

function resetForm() {
    editingId = null;
    form.reset();
    inputId.value = "";
}

function generarId() {
    return obras.length > 0 ? Math.max(...obras.map((o) => o.id)) + 1 : 1;
}
