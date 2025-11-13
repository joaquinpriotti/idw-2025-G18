import { MEDICO_DATOS_INICIALES, STORAGE_KEY } from './medicosData.js';

let logeado = sessionStorage.getItem("usuarioLogeado");

if(logeado === "admin"){
    alert("Bienvenido admin");
} else {
    alert("Lo sentimos, no posee privilegios para acceder a esta sección");
    window.location.href = "login.html";
}

// Estado local
let medicos = [];
let editingId = null;

// DOM
const formulario = document.getElementById('formularioAlta');
const tbody = document.getElementById('medicos-tbody');
const btnCancelar = document.getElementById('btnCancelar');

function init() {
    cargarMedicos();
    mostrarTabla();
    bindEvents();
}

function cargarMedicos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            medicos = JSON.parse(raw);
        } catch (e) {
            console.error('Error parseando médicos desde localStorage:', e);
            medicos = MEDICO_DATOS_INICIALES.slice();
            guardarMedicos();
        }
    } else {
        // primer ingreso: inicializa con los datos base
        medicos = MEDICO_DATOS_INICIALES.slice();
        guardarMedicos();
    }
}

function guardarMedicos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicos));
}

function mostrarTabla() {
    // limpia la tabla
    tbody.innerHTML = '';

    if (!medicos || medicos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" class="text-center">No hay médicos registrados</td>`;
        tbody.appendChild(tr);
        return;
    }

    medicos.forEach((m) => {

        let imagenCargada = "";
        if(m.imagen === ""){
            imagenCargada = "No";
        } else {
            imagenCargada = "Si";
        }

        const tr = document.createElement('tr');

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

    // agrega eventos dinámicos
    tbody.querySelectorAll('.editar-btn').forEach(b => b.addEventListener('click', onEditar));
    tbody.querySelectorAll('.eliminar-btn').forEach(b => b.addEventListener('click', onEliminar));
    tbody.querySelectorAll('.ver-btn').forEach(b => b.addEventListener('click', onVer));
}

function onVer(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    const m = medicos.find(x => x.id === id);
    if (!m) return;
    // muestra en un alert
    alert(
        `Médico:\nNombre: ${m.nombre}\nDNI: ${m.dni}\nMatrícula: ${m.matricula}\nEspecialidad: ${m.especialidad}\nObra Social: ${m.obraSocial || '-'}\nTeléfono: ${m.telefono || '-'}`
    );
}

function onEditar(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    const m = medicos.find(x => x.id === id);
    if (!m) return;

    // llena el formulario con los datos
    editingId = id;
    document.getElementById('medicoId').value = id;
    document.getElementById('nombreAlta').value = m.nombre || '';
    document.getElementById('dniAlta').value = m.dni || '';
    document.getElementById('matriculaAlta').value = m.matricula || '';
    document.getElementById('especialidadAlta').value = m.especialidad || '';
    document.getElementById('telefonoAlta').value = m.telefono || '';
    document.getElementById('obrasocialAlta').value = m.obraSocial || '';
    document.getElementById('imagenAlta').value = m.imagen || '';

    document.getElementById('nombreAlta').scrollIntoView({ behavior: 'smooth' });
}

function onEliminar(e) {
    const id = parseInt(e.currentTarget.dataset.id, 10);
    if (!confirm('¿Eliminar este médico? Esta acción no se puede deshacer.')) return;
    medicos = medicos.filter(x => x.id !== id);
    guardarMedicos();
    mostrarTabla();
}

function bindEvents() {
    if (formulario) {
        formulario.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const idHidden = document.getElementById('medicoId').value;
            if (idHidden) {
                actualizarMedico(parseInt(idHidden, 10));
            } else {
                agregarMedico();
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
    const max = medicos.reduce((acc, x) => (x.id > acc ? x.id : acc), 100);
    return max + 1;
}

function archivoABase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // Inicia la lectura

        reader.onload = () => resolve(reader.result); // Resuelve con la cadena Base64
        reader.onerror = (error) => reject(error); // Rechaza si hay un error
    });
}

async function agregarMedico() {
    const nombre = document.getElementById('nombreAlta').value.trim();
    const dni = document.getElementById('dniAlta').value.trim();
    const matricula = document.getElementById('matriculaAlta').value.trim();
    const especialidad = document.getElementById('especialidadAlta').value.trim();
    const telefono = document.getElementById('telefonoAlta').value.trim();
    const obraSocial = document.getElementById('obrasocialAlta').value.trim();

    const inputImagen = document.getElementById('imagenAlta');
    const archivoImagen = inputImagen.files[0];
    let imagenBase64 = '';
    
    if (archivoImagen) {
        try {
            // Llama a la función asíncrona y espera el resultado Base64
            imagenBase64 = await archivoABase64(archivoImagen);
        } catch (error) {
            console.error('Error al leer la imagen:', error);
            alert('Hubo un error al procesar la imagen.');
            return;
        }
    }

    // validación
    if (!nombre || !dni || !especialidad) {
        alert('Por favor complete los campos obligatorios: Nombre, DNI y Especialidad.');
        return;
    }

    const nuevo = {
        id: generarId(),
        matricula: matricula || '',
        nombre,
        dni,
        especialidad,
        telefono: telefono || '',
        obraSocial: obraSocial || '',
        imagen: imagenBase64,
    };

    medicos.push(nuevo);
    guardarMedicos();
    mostrarTabla();
    resetForm();
}

// actualización
async function actualizarMedico(id) {
    const index = medicos.findIndex(x => x.id === id);
    if (index === -1) return alert('No se encontró el médico a actualizar.');

    const nombre = document.getElementById('nombreAlta').value.trim();
    const dni = document.getElementById('dniAlta').value.trim();
    const matricula = document.getElementById('matriculaAlta').value.trim();
    const especialidad = document.getElementById('especialidadAlta').value.trim();
    const telefono = document.getElementById('telefonoAlta').value.trim();
    const obraSocial = document.getElementById('obrasocialAlta').value.trim();
    const imagen = document.getElementById('imagenAlta').value.trim();

    const inputImagen = document.getElementById('imagenAlta');
    const archivoImagen = inputImagen.files[0];
    let imagenBase64 = '';
    
    if (archivoImagen) {
        try {
            // Llama a la función asíncrona y espera el resultado Base64
            imagenBase64 = await archivoABase64(archivoImagen);
        } catch (error) {
            console.error('Error al leer la imagen:', error);
            alert('Hubo un error al procesar la imagen.');
            return;
        }
    }

    if (!nombre || !dni || !especialidad) {
        alert('Por favor complete los campos obligatorios: Nombre, DNI y Especialidad.');
        return;
    }

    medicos[index] = {
        ...medicos[index],
        nombre,
        dni,
        matricula,
        especialidad,
        telefono,
        obraSocial,
        imagen: imagenBase64,
    };

    guardarMedicos();
    mostrarTabla();
    resetForm();
}

function resetForm() {
    formulario.reset();
    editingId = null;
    document.getElementById('medicoId').value = '';
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
