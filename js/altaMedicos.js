// altaMedicos.js

import {
    MEDICO_DATOS_INICIALES,
    ESPECIALIDADES_DATOS_INICIALES,
    OBRAS_SOCIALES_DATOS_INICIALES,
    STORAGE_KEY_MEDICOS,
    STORAGE_KEY_ESPECIALIDADES,
    STORAGE_KEY_OBRAS
} from './medicosData.js';

// Control de acceso: solo admin
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

// DOM
const formulario = document.getElementById('formularioAlta');
const tbody = document.getElementById('medicos-tbody');
const btnCancelar = document.getElementById('btnCancelar');
const selectEspecialidad = document.getElementById('especialidadAlta');
const selectObrasSociales = document.getElementById('obrasSocialesAlta');
const inputImagen = document.getElementById('imagenAlta');

function init() {
    cargarEspecialidades();
    cargarObrasSociales();
    cargarMedicos();
    poblarSelects();
    mostrarTabla();
    bindEvents();
}

// Carga de datos desde localStorage
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

// Selects dinámicos
function poblarSelects() {
    if (selectEspecialidad) {
        selectEspecialidad.innerHTML = '<option value="">Seleccione una especialidad</option>';
        especialidades.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.id;
            opt.textContent = e.nombre;
            selectEspecialidad.appendChild(opt);
        });
    }

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

// ---- Helpers de visualización ----
function obtenerNombreEspecialidad(id) {
    const esp = especialidades.find(e => e.id === id);
    return esp ? esp.nombre : '-';
}

function obtenerNombresObras(ids) {
    if (!Array.isArray(ids)) return '-';
    const nombres = obrasSociales
        .filter(o => ids.includes(o.id))
        .map(o => o.nombre);
    return nombres.length ? nombres.join(', ') : '-';
}

// Tabla de médicos
function mostrarTabla() {
    tbody.innerHTML = '';

    if (!medicos || medicos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" class="text-center">No hay médicos registrados</td>`;
        tbody.appendChild(tr);
        return;
    }

    medicos.forEach((m) => {

        let imagenCargada = "";
        if (m.imagen === "") {
            imagenCargada = "No";
        } else {
            imagenCargada = "Si";
        }

        const tr = document.createElement('tr');

        const nombreCompleto = `${escapeHtml(m.apellido || '')}, ${escapeHtml(m.nombre || '')}`;
        const especialidadNombre = obtenerNombreEspecialidad(m.especialidadId);
        const obrasTexto = obtenerNombresObras(m.obrasSocialesIds);
        const valorTexto = m.valorConsulta ? `$ ${m.valorConsulta.toLocaleString('es-AR')}` : '-';
        const imagenSrc = m.imagen || 'img/Doctor sin foto.jpg';

        tr.innerHTML = `
      <td>${escapeHtml(m.nombre || '')}</td>
      <td>${escapeHtml(m.dni || '')}</td>
      <td>${escapeHtml(m.matricula || '')}</td>
      <td>${escapeHtml(m.especialidad || '')}</td>
      <td>${escapeHtml(m.obraSocial || '')}</td>
      <td>${escapeHtml(m.telefono || '')}</td>
      
      <td style="max-width: 100px; overflow: hidden">${imagenCargada}</td>
      <td>
        <button class="btn btn-sm btn-info ver-btn" data-id="${m.id}">Ver</button>
        <button class="btn btn-sm btn-primary editar-btn" data-id="${m.id}">Editar</button>
        <button class="btn btn-sm btn-danger eliminar-btn" data-id="${m.id}">Eliminar</button>
      </td>
    `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.ver-btn').forEach(b => b.addEventListener('click', onVer));
    tbody.querySelectorAll('.editar-btn').forEach(b => b.addEventListener('click', onEditar));
    tbody.querySelectorAll('.eliminar-btn').forEach(b => b.addEventListener('click', onEliminar));
}

// Acciones
function onVer(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    const m = medicos.find(x => x.id === id);
    if (!m) return;

    const especialidadNombre = obtenerNombreEspecialidad(m.especialidadId);
    const obrasTexto = obtenerNombresObras(m.obrasSocialesIds);
    const valorTexto = m.valorConsulta ? `$ ${m.valorConsulta.toLocaleString('es-AR')}` : '-';

    alert(
        `Médico:\n` +
        `Nombre: ${m.nombre} ${m.apellido}\n` +
        `Matrícula: ${m.matricula}\n` +
        `Especialidad: ${especialidadNombre}\n` +
        `Obras sociales: ${obrasTexto}\n` +
        `Valor consulta: ${valorTexto}\n\n` +
        `Descripción:\n${m.descripcion || '-'}`
    );
}

function onEditar(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    const m = medicos.find(x => x.id === id);
    if (!m) return;

    editingId = id;
    document.getElementById('medicoId').value = id;

    document.getElementById('nombreAlta').value = m.nombre || '';
    document.getElementById('apellidoAlta').value = m.apellido || '';
    document.getElementById('matriculaAlta').value = m.matricula ?? '';
    document.getElementById('descripcionAlta').value = m.descripcion || '';
    document.getElementById('valorConsultaAlta').value = m.valorConsulta ?? '';

    if (selectEspecialidad) {
        selectEspecialidad.value = m.especialidadId ?? '';
    }

    if (selectObrasSociales) {
        const ids = Array.isArray(m.obrasSocialesIds) ? m.obrasSocialesIds : [];
        Array.from(selectObrasSociales.options).forEach(opt => {
            opt.selected = ids.includes(Number(opt.value));
        });
    }

    if (inputImagen) {
        inputImagen.value = '';
    }

    document.getElementById('nombreAlta').scrollIntoView({ behavior: 'smooth' });
}

function onEliminar(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    if (!confirm('¿Eliminar este médico? Esta acción no se puede deshacer.')) return;
    medicos = medicos.filter(x => x.id !== id);
    guardarMedicos();
    mostrarTabla();
}

// Eventos globales
function bindEvents() {
    if (formulario) {
        formulario.addEventListener('submit', async (ev) => {
            ev.preventDefault();
            const idHidden = document.getElementById('medicoId').value;
            if (idHidden) {
                await actualizarMedico(parseInt(idHidden, 10));
            } else {
                await agregarMedico();
            }
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            resetForm();
        });
    }
}

// Utilidades de creación/actualización
function generarId() {
    const max = medicos.reduce((acc, x) => (x.id > acc ? x.id : acc), 100);
    return max + 1;
}

function archivoABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

// Crear
async function agregarMedico() {
    const nombre = document.getElementById('nombreAlta').value.trim();
    const apellido = document.getElementById('apellidoAlta').value.trim();
    const matricula = Number(document.getElementById('matriculaAlta').value);
    const especialidadId = Number(document.getElementById('especialidadAlta').value);
    const descripcion = document.getElementById('descripcionAlta').value.trim();
    const valorConsulta = Number(document.getElementById('valorConsultaAlta').value);

    const obrasIds = Array.from(selectObrasSociales.options)
        .filter(o => o.selected)
        .map(o => Number(o.value));

    let imagenBase64 = '';
    const archivoImagen = inputImagen?.files?.[0];

    if (!nombre || !apellido || !matricula || !especialidadId || !valorConsulta) {
        alert('Por favor complete los campos obligatorios: Nombre, Apellido, Matrícula, Especialidad y Valor de consulta.');
        return;
    }

    if (archivoImagen) {
        try {
            imagenBase64 = await archivoABase64(archivoImagen);
        } catch (error) {
            console.error('Error al leer la imagen:', error);
            alert('Hubo un error al procesar la imagen.');
            return;
        }
    }

    const nuevo = {
        id: generarId(),
        matricula,
        apellido,
        nombre,
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

// Actualizar
async function actualizarMedico(id) {
    const index = medicos.findIndex(x => x.id === id);
    if (index === -1) return alert('No se encontró el médico a actualizar.');

    const nombre = document.getElementById('nombreAlta').value.trim();
    const apellido = document.getElementById('apellidoAlta').value.trim();
    const matricula = Number(document.getElementById('matriculaAlta').value);
    const especialidadId = Number(document.getElementById('especialidadAlta').value);
    const descripcion = document.getElementById('descripcionAlta').value.trim();
    const valorConsulta = Number(document.getElementById('valorConsultaAlta').value);

    const obrasIds = Array.from(selectObrasSociales.options)
        .filter(o => o.selected)
        .map(o => Number(o.value));

    if (!nombre || !apellido || !matricula || !especialidadId || !valorConsulta) {
        alert('Por favor complete los campos obligatorios: Nombre, Apellido, Matrícula, Especialidad y Valor de consulta.');
        return;
    }

    let imagenBase64 = medicos[index].imagen;
    const archivoImagen = inputImagen?.files?.[0];

    if (archivoImagen) {
        try {
            imagenBase64 = await archivoABase64(archivoImagen);
        } catch (error) {
            console.error('Error al leer la imagen:', error);
            alert('Hubo un error al procesar la imagen.');
            return;
        }
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

function resetForm() {
    formulario.reset();
    editingId = null;
    document.getElementById('medicoId').value = '';
    if (inputImagen) {
        inputImagen.value = '';
    }
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
