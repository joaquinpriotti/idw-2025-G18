function estaLogeadoYRol() {
    const accessToken = sessionStorage.getItem("accessToken");
    const usuario = sessionStorage.getItem("usuarioLogeado");
    const rol = sessionStorage.getItem("rol");
    return {
        logeado: !!accessToken && !!usuario,
        usuario,
        rol
    };
}

function protegerPaginaAdmin() {
    const estado = estaLogeadoYRol();
    if (!(estado.logeado && estado.rol === "admin")) {
        alert("Acceso restringido. Debe iniciar sesión como administrador.");
        window.location.href = "login.html";
    }
}

function protegerPaginaClienteOPersonal() {
    const estado = estaLogeadoYRol();
    if (!estado.logeado) {
        alert("Debe iniciar sesión para acceder.");
        window.location.href = "login.html";
    }
}

function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "login.html";
}
