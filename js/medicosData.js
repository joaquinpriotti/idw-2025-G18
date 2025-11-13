

// ---- claves de LocalStorage ----
export const STORAGE_KEY_MEDICOS = 'medicos_data';
export const STORAGE_KEY_ESPECIALIDADES = 'especialidades_data';
export const STORAGE_KEY_OBRAS = 'obras_sociales_data';

// ---- Especialidades iniciales ----
export const ESPECIALIDADES_DATOS_INICIALES = [
    { id: 1, nombre: 'Cardiología' },
    { id: 2, nombre: 'Pediatría' },
    { id: 3, nombre: 'Traumatología' }
];

// ---- obras sociales iniciales ----
export const OBRAS_SOCIALES_DATOS_INICIALES = [
    {
        id: 1,
        nombre: 'OSDE',
        descripcion: 'Cobertura de salud privada con amplia cartilla.'
    },
    {
        id: 2,
        nombre: 'Swiss Medical',
        descripcion: 'Cobertura médica privada de alta complejidad.'
    },
    {
        id: 3,
        nombre: 'IOMA',
        descripcion: 'Obra social provincial para trabajadores estatales.'
    },
    {
        id: 4,
        nombre: 'Galeno',
        descripcion: 'Cobertura médica integral para distintos planes.'
    },
    {
        id: 5,
        nombre: 'SanCor',
        descripcion: 'Cobertura médica de origen cooperativo.'
    },
    {
        id: 6,
        nombre: 'Particular',
        descripcion: 'Atención sin obra social.'
    }
];

// ---- médicos iniciales (modelo normalizado) ----
// Modelo:
// {
//   id: number,
//   matricula: number,
//   apellido: string,
//   nombre: string,
//   especialidadId: number,
//   descripcion: string,
//   obrasSocialesIds: number[],
//   imagen: string (Base64 o ruta de imagen),
//   valorConsulta: number
// }

export const MEDICO_DATOS_INICIALES = [
    {
        id: 101,
        matricula: 12345,
        apellido: 'Pérez',
        nombre: 'Ricardo',
        especialidadId: 1, // Cardiología
        descripcion: 'Especialista en cardiología con más de 15 años de experiencia. Atiende por la mañana y la tarde.',
        obrasSocialesIds: [1, 2, 6], // OSDE, Swiss, Particular
        imagen: 'img/CardiologoWeb.png',
        obraSocial: 'Osde',
        descripcion: "El Dr. Ricardo Pérez es oriundo de Santa Fe y es reconocido en gran parte del país."
    },
    {
        id: 102,
        matricula: 67890,
        apellido: 'López',
        nombre: 'Ana',
        especialidadId: 2, // Pediatría
        descripcion: 'Pediatra especializada en control de crecimiento y desarrollo infantil.',
        obrasSocialesIds: [4, 5, 6], // Galeno, SanCor, Particular
        imagen: 'img/PediatraWeb.png',
        obraSocial: 'SanCor',
        descripcion: "La Dra. Ana López es oriunda de San Luis y es reconocida por su gran trabajo en los primeros años de los pacientes."
    }
];
