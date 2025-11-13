document.addEventListener("DOMContentLoaded", () => {
    const botonDinamico = document.getElementById("botonDinamico");
    const botonAdmin = document.getElementById("botonAdmin");

    // Si no hay navbar en la página, salir
    if (!botonDinamico) return;

    // Obtener datos de sesión
    const usuario = sessionStorage.getItem("usuarioLogeado");
    const rol = sessionStorage.getItem("rol");

    // Limpiar contenidos previos
    if (botonDinamico) botonDinamico.innerHTML = "";
    if (botonAdmin) botonAdmin.innerHTML = "";

    // Si el usuario no está logueado, mostrar "iniciar sesión"
    if (!usuario) {
        const btnLogin = document.createElement("a");
        btnLogin.href = "login.html";
        btnLogin.className = "nav-link text-light";
        btnLogin.textContent = "Iniciar sesión";
        botonDinamico.appendChild(btnLogin);
        return;
    }

    // Si el usuario está logueado, mostrar "cerrar sesion"
    const btnLogout = document.createElement("a");
    btnLogout.href = "#";
    btnLogout.className = "nav-link text-light";
    btnLogout.textContent = "Cerrar sesión";
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        if (typeof cerrarSesion === "function") {
            cerrarSesion();
        } else {
            sessionStorage.clear();
            window.location.href = "login.html";
        }
    });
    botonDinamico.appendChild(btnLogout);

    // según el rol, agrega acceso específico
    if (botonAdmin) {
        if (rol === "admin") {
            // Panel del administrador
            const btnAdmin = document.createElement("a");
            btnAdmin.href = "admin.html";
            btnAdmin.className = "nav-link text-warning";
            btnAdmin.textContent = "Panel Admin";
            botonAdmin.appendChild(btnAdmin);
        } else if (rol === "cliente") {
            // Sección de turnos del cliente
            const btnCliente = document.createElement("a");
            btnCliente.href = "turnosCliente.html";
            btnCliente.className = "nav-link text-info";
            btnCliente.textContent = "Mis Turnos";
            botonAdmin.appendChild(btnCliente);
        }
    }
});
