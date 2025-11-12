function estaLogeadoYRol() {
    const accessToken = sessionStorage.getItem("accessToken");
    const usuario = sessionStorage.getItem("usuarioLogeado");
    const rol = sessionStorage.getItem("rol"); // admin o visitante o null

    return {
        logeado: !!accessToken && !!usuario,
        usuario,
        rol
    };
}

function actualizarNav() {
    const contenedorBoton = document.getElementById("botonDinamico");
    const contenedorAdmin = document.getElementById("botonAdmin");

    const estado = estaLogeadoYRol();

    // Botón de login / logout
    if (contenedorBoton) {
        if (estado.logeado) {
            // Mostrar "Cerrar sesión" (link que llama a cerrarSesion)
            contenedorBoton.innerHTML = `<li class="nav-item"><a id="botonDinamico" class="nav-link" href="#" >Cerrar sesión</a></li>`;
            const boton = document.getElementById("botonDinamico");
            boton && boton.addEventListener("click", function (e) {
                e.preventDefault();
                // cerrarSesion está en js/login.js
                if (typeof cerrarSesion === "function") cerrarSesion(e);
                else {
                    sessionStorage.removeItem("accessToken");
                    sessionStorage.removeItem("usuarioLogeado");
                    sessionStorage.removeItem("rol");
                    window.location.reload();
                }
            });
        } else {
            contenedorBoton.innerHTML = `<li class="nav-item"><a id="botonDinamicoLogin" class="nav-link" href="login.html">Iniciar sesión</a></li>`;
        }
    }

    // Botón o sección de administración (solo visible para rol admin)
    if (contenedorAdmin) {
        if (estado.logeado && estado.rol === "admin") {
            // Mostrar link al panel admin y al listado de usuarios
            contenedorAdmin.innerHTML = `
                <li class="nav-item"><a class="nav-link" href="admin.html">Panel Admin</a></li>
                <li class="nav-item"><a class="nav-link" href="admin_usuarios.html">Usuarios</a></li>
            `;
        } else {
            contenedorAdmin.innerHTML = ""; // ocultar
        }
    }
}

// Protección para páginas admin: IMPORTANTE usar en la cabecera de las páginas admin!!
function protegerPaginaAdmin() {
    const estado = estaLogeadoYRol();
    if (!(estado.logeado && estado.rol === "admin")) {
        // No autorizado -> redirigir a login
        alert("Acceso restringido. Debe iniciar sesión como administrador.");
        window.location.href = "login.html";
    }
}

document.addEventListener("DOMContentLoaded", actualizarNav);