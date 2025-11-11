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
    }
];

// Clave para LocalStorage
export const STORAGE_KEY = 'medicos_data';