export const MEDICO_DATOS_INICIALES = [
    {
        id: 101,
        matricula: 'MN-12345',
        nombre: 'Dr. Ricardo Pérez',
        dni: 23654978,
        especialidad: 'Cardiología',
        telefono: '11-4567-8901',
        imagen: 'img/CardiologoWeb.png',
        obraSocial: 'Osde',
        descripcion: "El Dr. Ricardo Pérez es oriundo de Santa Fe y es reconocido en gran parte del país."
    },
    {
        id: 102,
        matricula: 'MP-67890',
        nombre: 'Dra. Ana López',
        dni: 35684129,
        especialidad: 'Pediatría',
        telefono: '11-3000-4000',
        imagen: 'img/PediatraWeb.png',
        obraSocial: 'SanCor',
        descripcion: "La Dra. Ana López es oriunda de San Luis y es reconocida por su gran trabajo en los primeros años de los pacientes."
    }
];

// Clave para LocalStorage
export const STORAGE_KEY = 'medicos_data';