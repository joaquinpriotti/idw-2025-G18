import { turnos_disponibles, STORAGE_KEY } from './turnos.js';

// Estado local
let turnos = [];
let editingId = null;

// DOM
const formulario = document.getElementById('formularioTurnos');
const tbody = document.getElementById('turnos-tbody');
const btnCancelar = document.getElementById('btnLimpiar');

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
                    <button class="btn btn-sm btn-primary guardar-btn" data-id="${t.id}">Guardar turno</button>
                    <button class="btn btn-sm btn-danger cancelar-btn" data-id="${t.id}">Cancelar turno</button>
                </td>
            `;
        tbody.appendChild(tr);
    });

    // agrega eventos dinámicos
    tbody.querySelectorAll('.guardar-btn').forEach(b => b.addEventListener('click', obtenerTurno));
    tbody.querySelectorAll('.cancelar-btn').forEach(b => b.addEventListener('click', cancelarTurno));
    actualizarFiltroEspecialidades();
}

function obtenerTurno(e) {
    const idTurno = parseInt(e.currentTarget.dataset.id, 10);
    
    const turnoSeleccionado = turnos.find(t => t.id === idTurno);

    let valorTurno = calcularCosto(e);

    if (!turnoSeleccionado) {
        console.error('Error: Turno no encontrado con ID:', idTurno);
        return;
    }
    
    if (turnoSeleccionado.disponible === "Reservado"){
        alert("El turno que desea guardar ya se encuentra reservado.");
        return;
    }


    if (!confirm(`¿Desea guardar el turno para ${turnoSeleccionado.medico} el ${turnoSeleccionado.fecha}?
    El valor del mismo es de $${valorTurno}.
        `)) {
        return;
    }

    alert(
        `Su turno ha sido guardadoc con éxtio:
        Médico: ${turnoSeleccionado.medico}.
        Fecha: ${turnoSeleccionado.fecha}.
        Horario: ${turnoSeleccionado.horario}.
        Obra social: ${turnoSeleccionado.obraSocial}.
        Valor: $${valorTurno}.       
        `
    )
    turnoSeleccionado.disponible = 'Reservado';

    
    guardarTurnos();
    mostrarTabla();
    resetForm();
}

function cancelarTurno(e) {
    const idTurno = parseInt(e.currentTarget.dataset.id, 10);
    
    const turnoSeleccionado = turnos.find(t => t.id === idTurno);

    if (!turnoSeleccionado) {
        console.error('Error: Turno no encontrado con ID:', idTurno);
        return;
    }

    if (turnoSeleccionado.disponible === "Disponible"){
        alert("El turno que desea cancelar ya se encuentra disponible.");
        return;
    }

    if (!confirm(`¿Desea cancelar el turno para ${turnoSeleccionado.medico} el ${turnoSeleccionado.fecha}?`)) {
        return;
    }

    turnoSeleccionado.disponible = 'Disponible';


    guardarTurnos();
    mostrarTabla();
    resetForm();
}

function bindEvents() {
    if (formulario) {
        formulario.addEventListener('submit', (ev) => {
            ev.preventDefault();
            const idHidden = document.getElementById('turnosId').value;
            if (idHidden) {
                actualizarMedico(parseInt(idHidden, 10));
            }
        });
    }

    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            resetForm();
        });
    }
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


document.getElementById('formularioTurnos').addEventListener('submit', function(event) {
    event.preventDefault(); // Previene el envío por defecto

    filtrarTurnos();
    });

function filtrarTurnos() {
    const fechaAFiltrar = document.getElementById('fechaFiltro').value;
    const especialidadAFiltrar = document.getElementById('especialidadFiltro').value;
    const obraSocialAFiltrar = document.getElementById('obrasocialFiltro').value;
    const medicoAFiltrar = document.getElementById('medicoFiltro').value;
    const tbody = document.getElementById('turnos-tbody');
    
    tbody.innerHTML = ''; 

    if (!turnos || !Array.isArray(turnos)) {
        console.error("La variable 'turnos' no está definida o no es un array.");
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" class="text-center">Error: Datos de turnos no disponibles.</td>`;
        tbody.appendChild(tr);
        return;
    }
    
    const turnosFiltrados = turnos.filter(turno => {

        const coincideFecha = !fechaAFiltrar || turno.fecha === fechaAFiltrar;

        const coincideEspecialidad = !especialidadAFiltrar || especialidadAFiltrar === "" || turno.especialidad === especialidadAFiltrar;

        const coincideObraSocial = !obraSocialAFiltrar || obraSocialAFiltrar === "" || turno.obraSocial === obraSocialAFiltrar;

        const coincideMedico = !medicoAFiltrar || medicoAFiltrar === "" || turno.medico === medicoAFiltrar;

        return coincideFecha && coincideEspecialidad && coincideObraSocial && coincideMedico;
    });

    if (turnosFiltrados.length > 0) {
        turnosFiltrados.forEach((t) => {
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

    // agrega eventos dinámicos
    tbody.querySelectorAll('.guardar-btn').forEach(b => b.addEventListener('click', obtenerTurno));
    tbody.querySelectorAll('.cancelar-btn').forEach(b => b.addEventListener('click', cancelarTurno));
    } else {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="7" class="text-center">No hay turnos disponibles que coincidan con los filtros.</td>`;
        tbody.appendChild(tr);
    }
};

function actualizarFiltroEspecialidades() {

    const selectFiltro = document.getElementById('especialidadFiltro');
    
    while (selectFiltro.options.length > 1) {
        selectFiltro.remove(1);
    }
    
    if (!turnos || turnos.length === 0) {
        return;
    }
    
    const especialidadesUnicas = new Set();
    
    turnos.forEach(turno => {
        if (turno.especialidad) {
            especialidadesUnicas.add(turno.especialidad);
        }
    });
    
    especialidadesUnicas.forEach(especialidad => {
        const nuevaOpcion = document.createElement('option');
        nuevaOpcion.value = especialidad;
        nuevaOpcion.textContent = especialidad;
        
        selectFiltro.appendChild(nuevaOpcion);
    });
}

function calcularCosto(e) {

    const idTurno = parseInt(e.currentTarget.dataset.id, 10);
    
    const turnoSeleccionado = turnos.find(t => t.id === idTurno);

    let costoTurno = 0

    if (!turnoSeleccionado) {
        console.error('Error: Turno no encontrado con ID:', idTurno);
        return;
    }

    switch(turnoSeleccionado.especialidad){
        case "Cardiología": 
            costoTurno += 18000;
            break;
        case "Dermatología": 
            costoTurno += 20000;
            break;
        case "Traumatología": 
            costoTurno += 15000;
            break;
    }
    switch(turnoSeleccionado.obraSocial){
        case "OSDE":
            costoTurno = costoTurno-(costoTurno*25/100);
            break;
        case "PAMI":
            costoTurno = costoTurno-(costoTurno*50/100);
            break;
        case "Particular":
            break;
    }

    return costoTurno
}