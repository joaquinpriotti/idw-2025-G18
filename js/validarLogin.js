function estaLogeado() {
    const logeado = sessionStorage.getItem("usuarioLogeado");
    const contenedorBoton = document.getElementById("botonDinamico");
    const contenedorAdmin = document.getElementById("botonAdmin");

    // ---- Boton login ----
    if (logeado === "admin" || logeado === "cliente") {
        contenedorBoton.innerHTML =
            `<li class="nav-item"><a id="botonDinamico" class="nav-link" href="login.html">Cerrar sesión</a></li>`;

        const otroBoton = document.getElementById("botonDinamico");
        if (otroBoton) {
            otroBoton.addEventListener("click", cerrarSesion);
        }
    } else {
        contenedorBoton.innerHTML =
            `<li class="nav-item"><a id="botonDinamico" class="nav-link" href="login.html">Iniciar sesión</a></li>`;
    }

    // ---- Boton adm medicos ----
    if (contenedorAdmin) {
        if (logeado === "admin" || logeado === "cliente") {
            contenedorAdmin.innerHTML =
                `<li class="nav-item"><a class="nav-link" href="admin.html">Administrar Médicos</a></li>`;
        } else {
            contenedorAdmin.innerHTML = "";
        }
    }
}

function cerrarSesion(event) {
    event.preventDefault();

    let logeado = sessionStorage.getItem("usuarioLogeado");

    if (logeado === "admin" || logeado === "cliente") {
        sessionStorage.removeItem("usuarioLogeado");
        window.location.reload();
    }
}

estaLogeado();
