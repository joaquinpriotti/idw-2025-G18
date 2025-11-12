document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = document.getElementById("usuario").value.trim();
        const contraseña = document.getElementById("contraseña").value.trim();

        // Verifica usuario hardcodeado
        const usuarioLocal = usuarios.find(
            (u) => u.usuario === usuario && u.contraseña === contraseña
        );

        if (usuarioLocal) {
            iniciarSesion(usuarioLocal.usuario, usuarioLocal.usuario === "admin" ? "admin" : "cliente");
            return;
        }

        // Si no está en local, buscar en la API
        try {
            const response = await fetch("https://dummyjson.com/users");
            if (!response.ok) throw new Error("Error al conectarse a la API");
            const data = await response.json();

            // la API devuelve data.users
            const usuarioApi = data.users.find(
                (u) => u.username.toLowerCase() === usuario.toLowerCase()
            );

            if (usuarioApi && usuarioApi.password === contraseña) {
                iniciarSesion(usuarioApi.username, "cliente");
            } else {
                mostrarMensaje("Usuario o contraseña incorrectos", "danger");
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            mostrarMensaje("No se pudo conectar con el servidor.", "danger");
        }
    });

    // 🔹 funciones auxiliares
    function iniciarSesion(nombreUsuario, rol) {
        sessionStorage.setItem("accessToken", "token_simulado_" + Date.now());
        sessionStorage.setItem("usuarioLogeado", nombreUsuario);
        sessionStorage.setItem("rol", rol);

        mostrarMensaje("Inicio de sesión exitoso. Redirigiendo...", "success");

        setTimeout(() => {
            if (rol === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        }, 1200);
    }

    function mostrarMensaje(texto, tipo) {
        mensaje.className = `alert alert-${tipo} text-center`;
        mensaje.textContent = texto;
        mensaje.classList.remove("d-none");
    }
});
