document.addEventListener("DOMContentLoaded", () => {
    const rol = sessionStorage.getItem("rol");
    if (rol !== "admin") {
        alert("Acceso restringido. Inicie sesión como administrador.");
        window.location.href = "login.html";
        return;
    }

    cargarUsuarios();
});

async function cargarUsuarios() {
    const placeholder = document.getElementById("alertPlaceholder");
    const cont = document.getElementById("tablaUsuarios");
    if (!cont || !placeholder) return;

    cont.innerHTML = "";
    placeholder.innerHTML = `<div class="alert alert-info">Cargando usuarios...</div>`;

    try {
        const res = await fetch("https://dummyjson.com/users?limit=10");
        const data = await res.json();
        const users = Array.isArray(data.users) ? data.users : [];

        if (!users.length) {
            placeholder.innerHTML = `<div class="alert alert-warning">No se encontraron usuarios.</div>`;
            return;
        }

        let html = `
            <div class="table-responsive">
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
            </div>
        `;

        users.forEach((u, i) => {
            html += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${u.username || "-"}</td>
                    <td>${u.firstName || "-"}</td>
                    <td>${u.lastName || "-"}</td>
                    <td>${u.email || "-"}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        cont.innerHTML = html;
        placeholder.innerHTML = `<div class="alert alert-success">Usuarios cargados: ${users.length}</div>`;
    } catch (err) {
        console.error(err);
        placeholder.innerHTML = `
            <div class="alert alert-danger">
                No se pudieron cargar los usuarios. Verifique la conexión o intente nuevamente.
            </div>
        `;
    }
}
