import { MEDICO_DATOS_INICIALES, STORAGE_KEY } from './medicosData.js';

const logeado = sessionStorage.getItem("usuarioLogeado");

if (logeado !== "admin") {
    // Si no es admin, redirige inmediatamente.
    alert("Lo sentimos, no posee privilegios para acceder a esta sección");
    window.location.href = "login.html";
}

let medicos = [];

const guardarMedicos = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicos));
};

// funcion del listado 

const mostrarTabla = () => {
    const tbody = document.getElementById('medicos-tbody');
    if (!tbody) return; 

    tbody.innerHTML = '';

    medicos.forEach((medico) => {
        const row = tbody.insertRow();
        
        row.insertCell().textContent = medico.matricula;
        row.insertCell().textContent = medico.nombre;
        row.insertCell().textContent = medico.especialidad;
        row.insertCell().textContent = medico.telefono;
    });
};

// Funcion para cargar los medicos 

/** carga los médicos de LocalStorage o lo inicializa si es la primera vez.
 */
const cargarMedicos = () => {
    const storedMedicos = localStorage.getItem(STORAGE_KEY);
    
    if (storedMedicos) {
        medicos = JSON.parse(storedMedicos);
    } else {
        medicos = MEDICO_DATOS_INICIALES;
        guardarMedicos(); 
    }
    
    mostrarTabla();
};

// funcion de alta o agregar 

const agregarMedico = (event) => {
    event.preventDefault(); 
    const form = event.target;
    
    const nombre = document.getElementById('nombre-medico').value.trim();
    const matricula = document.getElementById('matricula-medico').value.trim();
    const especialidad = document.getElementById('especialidad-medico').value.trim();
    const telefono = document.getElementById('telefono-medico').value.trim();

    if (!nombre || !matricula || !especialidad) {
        return alert("Faltan campos obligatorios.");
    }

    const nuevoMedico = {
        id: Date.now(), // esto es un ID único para el futuro CRUD de joaco
        matricula,
        nombre,
        especialidad,
        telefono
    };

    medicos.push(nuevoMedico);
    guardarMedicos(); 
    mostrarTabla();  
    form.reset();   
};


// inician los eventos 

document.addEventListener('DOMContentLoaded', () => {
    cargarMedicos();

    const formulario = document.getElementById('form-alta-medico');
    if (formulario) {
        formulario.addEventListener('submit', agregarMedico);
    }
});