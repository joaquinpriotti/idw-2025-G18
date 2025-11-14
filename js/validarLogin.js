// Funciones de validación y control de sesión

// verifica si hay un usuario logueado y devuelve su estado
function estaLogeadoYRol() {
    const accessToken = sessionStorage.getItem("accessToken"); // token de sesión
    const usuario = sessionStorage.getItem("usuarioLogeado");  // nombre de usuario
    const rol = sessionStorage.getItem("rol");                  // "admin" o "cliente"

    // Devuelve un objeto con la información actual del usuario
    return {
        logeado: !!accessToken && !!usuario, // true si existe token y usuario
        usuario,
        rol
    };
}

// Protege páginas de administración (solo accesibles por el admin)
function protegerPaginaAdmin() {
    const estado = estaLogeadoYRol();

    // Si no está logueado o no tiene rol admin → redirige
    if (!(estado.logeado && estado.rol === "admin")) {
        alert("Acceso restringido. Debe iniciar sesión como administrador.");
        window.location.href = "login.html";
    }
}

// Protege páginas accesibles por cualquier usuario logueado
function protegerPaginaClienteOPersonal() {
    const estado = estaLogeadoYRol();

    // Si no está logueado, redirige al login
    if (!estado.logeado) {
        alert("Debe iniciar sesión para acceder.");
        window.location.href = "login.html";
    }
}

// Cierra sesión y limpia el almacenamiento de sesión
function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "login.html";
}
