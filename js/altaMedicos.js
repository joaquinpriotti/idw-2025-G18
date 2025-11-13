import {
    MEDICO_DATOS_INICIALES,
    ESPECIALIDADES_DATOS_INICIALES,
    OBRAS_SOCIALES_DATOS_INICIALES,
    STORAGE_KEY_MEDICOS,
    STORAGE_KEY_ESPECIALIDADES,
    STORAGE_KEY_OBRAS
} from './medicosData.js';

// Control de acceso
const rol = sessionStorage.getItem("rol");
if (rol !== "admin") {
    alert("Acceso restringido. Debes iniciar sesión como administrador.");
    window.location.href = "login.html";
}

// Estado local
let medicos = [];
let especialidades = [];
let obrasSociales = [];
let editingId = null;

// dom
const formulario = document.getElementById('formularioAlta');
const tbody = document.getElementById('medicos-tbody');
const btnCancelar = document.getElementById('btnCancelar');
const selectEspecialidad = document.getElementById('especialidadAlta');
const selectObrasSociales = document.getElementById('obrasSocialesAlta');
const inputImagen = document.getElementById('imagenAlta');

// Inicialización
function init() {
    cargarEspecialidades();
    cargarObrasSociales();
    cargarMedicos();
    poblarSelects();
    mostrarTabla();
    bindEvents();
}

// Carga del localstorage
function cargarEspecialidades() {
    const raw = localStorage.getItem(STORAGE_KEY_ESPECIALIDADES);
    if (raw) {
        try { especialidades = JSON.parse(raw); }
        catch (e) {
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
        try { obrasSociales = JSON.parse(raw); }
        catch (e) {
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
        try { medicos = JSON.parse(raw); }
        catch (e) {
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

// Select dinamicos
function poblarSelects() {
    // Especialidades
    if (selectEspecialidad) {
        selectEspecialidad.innerHTML = '<option value="">Seleccione una especialidad</option>';
        especialidades.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            opt.textContent = e.nombre;
            selectEspecialidad.appendChild(opt);
        });
    }

    // Obras Sociales
    if (selectObrasSociales) {
        selectObrasSociales.innerHTML = '';
        obrasSociales.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.id;
            opt.textContent = o.nombre;
            selectObrasSociales.appendChild(opt);
        });
    }
}

// Visualización
function obtenerNombreEspecialidad(id) {
    const esp = especialidades.find(e => e.id === id);
    return esp ? esp.nombre : "-";
}

function obtenerNombresObras(ids) {
    if (!Array.isArray(ids)) return "-";
    const nombres = obrasSociales
        .filter(o => ids.includes(o.id))
        .map(o => o.nombre);
    return nombres.length ? nombres.join(", ") : "-";
}

function escapeHtml(texto) {
    if (!texto) return "";
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Tabla de medicos
function mostrarTabla() {
    tbody.innerHTML = "";

    if (medicos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No hay médicos registrados</td>
            </tr>
        `;
        return;
    }

    medicos.forEach(m => {
        const tr = document.createElement("tr");

        const especialidadNombre = obtenerNombreEspecialidad(m.especialidadId);
        const obrasTexto = obtenerNombresObras(m.obrasSocialesIds);
        const valorTexto = m.valorConsulta
            ? `$ ${m.valorConsulta.toLocaleString("es-AR")}`
            : "-";
        const imagenSrc = m.imagen || "img/Doctor sin foto.jpg";

        tr.innerHTML = `
            <td>${escapeHtml(m.apellido)}, ${escapeHtml(m.nombre)}</td>
            <td>${escapeHtml(m.matricula)}</td>
            <td>${escapeHtml(especialidadNombre)}</td>
            <td>${escapeHtml(obrasTexto)}</td>
            <td>${escapeHtml(valorTexto)}</td>
            <td><img src="${imagenSrc}" alt="Foto médico" style="max-width:100px; border-radius:5px"></td>
            <td class="d-flex flex-column gap-1">
                <button class="btn btn-sm btn-info ver-btn" data-id="${m.id}">Ver</button>
                <button class="btn btn-sm btn-primary editar-btn" data-id="${m.id}">Editar</button>
                <button class="btn btn-sm btn-danger eliminar-btn" data-id="${m.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Eventos por botón
    tbody.querySelectorAll('.ver-btn').forEach(b => b.addEventListener('click', onVer));
    tbody.querySelectorAll('.editar-btn').forEach(b => b.addEventListener('click', onEditar));
    tbody.querySelectorAll('.eliminar-btn').forEach(b => b.addEventListener('click', onEliminar));
}

// Botones
function onVer(e) {
    const id = Number(e.currentTarget.dataset.id);
    const m = medicos.find(x => x.id === id);
    if (!m) return;

    const especialidadNombre = obtenerNombreEspecialidad(m.especialidadId);
    const obrasTexto = obtenerNombresObras(m.obrasSocialesIds);
    const valorTexto = m.valorConsulta ? `$ ${m.valorConsulta.toLocaleString("es-AR")}` : "-";

    alert(
        `Médico:\n` +
        `Nombre: ${m.nombre} ${m.apellido}\n` +
        `Matrícula: ${m.matricula}\n` +
        `Especialidad: ${especialidadNombre}\n` +
        `Obras Sociales: ${obrasTexto}\n` +
        `Valor Consulta: ${valorTexto}\n\n` +
        `Descripción:\n${m.descripcion || "-"}`
    );
}

function onEditar(e) {
    const id = Number(e.currentTarget.dataset.id);
    const m = medicos.find(x => x.id === id);
    if (!m) return;

    editingId = id;

    document.getElementById("medicoId").value = id;
    document.getElementById("nombreAlta").value = m.nombre;
    document.getElementById("apellidoAlta").value = m.apellido;
    document.getElementById("matriculaAlta").value = m.matricula;
    document.getElementById("descripcionAlta").value = m.descripcion;
    document.getElementById("valorConsultaAlta").value = m.valorConsulta;

    selectEspecialidad.value = m.especialidadId;

    Array.from(selectObrasSociales.options).forEach(opt => {
        opt.selected = m.obrasSocialesIds.includes(Number(opt.value));
    });

    if (inputImagen) inputImagen.value = "";

    document.getElementById('nombreAlta').scrollIntoView({ behavior: 'smooth' });
}

function onEliminar(e) {
    const id = Number(e.currentTarget.dataset.id);
    if (!confirm("¿Eliminar este médico?")) return;

    medicos = medicos.filter(x => x.id !== id);
    guardarMedicos();
    mostrarTabla();
}

// Eventos formulario
function bindEvents() {
    formulario.addEventListener("submit", async (ev) => {
        ev.preventDefault();

        const idHidden = document.getElementById("medicoId").value;

        if (idHidden) {
            await actualizarMedico(Number(idHidden));
        } else {
            await agregarMedico();
        }
    });

    btnCancelar.addEventListener("click", resetForm);
}

// crear medico
function generarId() {
    const max = medicos.reduce((acc, x) => (x.id > acc ? x.id : acc), 100);
    return max + 1;
}

function archivoABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = err => reject(err);
    });
}

async function agregarMedico() {
    const nombre = document.getElementById("nombreAlta").value.trim();
    const apellido = document.getElementById("apellidoAlta").value.trim();
    const matricula = Number(document.getElementById("matriculaAlta").value);
    const especialidadId = Number(document.getElementById("especialidadAlta").value);
    const descripcion = document.getElementById("descripcionAlta").value.trim();
    const valorConsulta = Number(document.getElementById("valorConsultaAlta").value);

    if (!nombre || !apellido || !matricula || !especialidadId || !valorConsulta) {
        alert("Complete los campos obligatorios.");
        return;
    }

    const obrasIds = Array.from(selectObrasSociales.options)
        .filter(o => o.selected)
        .map(o => Number(o.value));

    let imagenBase64 = "";
    const archivo = inputImagen?.files?.[0];

    if (archivo) {
        imagenBase64 = await archivoABase64(archivo);
    }

    const nuevo = {
        id: generarId(),
        nombre,
        apellido,
        matricula,
        especialidadId,
        descripcion,
        obrasSocialesIds: obrasIds,
        imagen: imagenBase64,
        valorConsulta
    };

    medicos.push(nuevo);
    guardarMedicos();
    mostrarTabla();
    resetForm();
}

// actualizar medico
async function actualizarMedico(id) {
    const index = medicos.findIndex(x => x.id === id);
    if (index === -1) return;

    const nombre = document.getElementById("nombreAlta").value.trim();
    const apellido = document.getElementById("apellidoAlta").value.trim();
    const matricula = Number(document.getElementById("matriculaAlta").value);
    const especialidadId = Number(document.getElementById("especialidadAlta").value);
    const descripcion = document.getElementById("descripcionAlta").value.trim();
    const valorConsulta = Number(document.getElementById("valorConsultaAlta").value);

    if (!nombre || !apellido || !matricula || !especialidadId || !valorConsulta) {
        alert("Complete los campos obligatorios.");
        return;
    }

    const obrasIds = Array.from(selectObrasSociales.options)
        .filter(o => o.selected)
        .map(o => Number(o.value));

    let imagenBase64 = medicos[index].imagen;
    const archivo = inputImagen?.files?.[0];

    if (archivo) {
        imagenBase64 = await archivoABase64(archivo);
    }

    medicos[index] = {
        ...medicos[index],
        nombre,
        apellido,
        matricula,
        especialidadId,
        descripcion,
        obrasSocialesIds: obrasIds,
        imagen: imagenBase64,
        valorConsulta
    };

    guardarMedicos();
    mostrarTabla();
    resetForm();
}

// Reset form
function resetForm() {
    formulario.reset();
    editingId = null;
    document.getElementById("medicoId").value = "";
    if (inputImagen) inputImagen.value = "";
}

// Inicializar todo
init();
