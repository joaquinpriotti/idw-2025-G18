// Proteger la página (solo admin)
document.addEventListener("DOMContentLoaded", () => {
    // protegerPaginaAdmin() está definido en validarLogin.js
    if (typeof protegerPaginaAdmin === "function") {
        protegerPaginaAdmin();
    } else {
        // si validarLogin.js no está cargado, comprobamos rol básico
        const rol = sessionStorage.getItem("rol");
        if (rol !== "admin") {
            alert("Acceso restringido. Inicie sesión como administrador.");
            window.location.href = "login.html";
            return;
        }
    }

    cargarUsuarios();
});

async function cargarUsuarios() {
    const placeholder = document.getElementById("alertPlaceholder");
    const cont = document.getElementById("tablaUsuarios");
    cont.innerHTML = "";

    // Mensaje de carga
    placeholder.innerHTML = `<div class="alert alert-info">Cargando usuarios...</div>`;

    try {
        const url = "https://dummyjson.com/users?limit=10"; // obtenemos los primeros 10 usuarios
        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error(`Error al obtener usuarios: ${resp.status}`);
        }

        const data = await resp.json();
        const lista = data && data.users ? data.users : [];

        if (!lista.length) {
            placeholder.innerHTML = `<div class="alert alert-warning">No se encontraron usuarios.</div>`;
            return;
        }

        // Filtra campos sensibles (solo se muestran datos básicos)
        const filas = lista.map(u => ({
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            age: u.age,
            gender: u.gender,
        }));

        // Construir tabla HTML
        let html = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Edad</th>
                    <th>Género</th>
                </tr>
            </thead>
            <tbody>
        `;

        for (const f of filas) {
            html += `
                <tr>
                    <td>${f.id}</td>
                    <td>${f.firstName}</td>
                    <td>${f.lastName}</td>
                    <td>${f.age}</td>
                    <td>${f.gender}</td>
                </tr>
            `;
        }

        html += `</tbody></table>`;
        cont.innerHTML = html;

        placeholder.innerHTML = `<div class="alert alert-success">Usuarios cargados: ${filas.length}</div>`;

    } catch (err) {
        console.error(err);
        placeholder.innerHTML = `
            <div class="alert alert-danger">No se pudieron cargar los usuarios.<br>
                Puede que no tengas conexión a Internet o que la página de DummyJSON no esté disponible.<br>
                Probá volver a intentarlo más tarde.
            </div>
`;

    }
}
