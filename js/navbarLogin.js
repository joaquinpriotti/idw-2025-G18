document.addEventListener("DOMContentLoaded", () => {
    const botonDinamico = document.getElementById("botonDinamico");
    const botonAdmin = document.getElementById("botonAdmin");

    if (!botonDinamico) return;

    const usuario = sessionStorage.getItem("usuarioLogeado");
    const rol = sessionStorage.getItem("rol");

    botonDinamico.innerHTML = "";
    botonAdmin.innerHTML = "";

    // Si no hay sesión, muestra "Iniciar sesión"
    if (!usuario) {
        const btnLogin = document.createElement("a");
        btnLogin.href = "login.html";
        btnLogin.className = "nav-link text-light";
        btnLogin.textContent = "Iniciar sesión";
        botonDinamico.appendChild(btnLogin);
        return;
    }

    // Si hay sesión cliente, muestra "cerrar sesion"
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

    // 🔹 Si es admin, agrega link al panel de administración
    if (rol === "admin" && botonAdmin) {
        const btnAdmin = document.createElement("a");
        btnAdmin.href = "admin.html";
        btnAdmin.className = "nav-link text-warning";
        btnAdmin.textContent = "Panel Admin";
        botonAdmin.appendChild(btnAdmin);
    }
});
