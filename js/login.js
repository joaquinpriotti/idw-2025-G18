// Maneja el inicio de sesión local (usuarios.js) y remoto (DummyJSON API).
// Guarda el token y el rol del usuario en sessionStorage.

import { usuarios } from './usuarios.js';

document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("formLogin");
    const alertPlaceholder = document.getElementById("alertPlaceholder");

    if (!formLogin) return; // Evita errores si no existe el formulario en la página

    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtiene los datos ingresados en el formulario
        const usuario = document.getElementById("usuario").value.trim();
        const contraseña = document.getElementById("contraseña").value.trim();

        // Chequeo que no existan campos vacíos
        if (!usuario || !contraseña) {
            mostrarMensaje("Debe completar todos los campos.", "warning");
            return;
        }

        // Intentar validar usuario localmente (usuarios.js)
        const userLocal = usuarios.find(
            (u) => u.usuario === usuario && u.contraseña === contraseña
        );

        if (userLocal) {
            // Si existe, crear token local y definir rol según el usuario
            const rol = usuario === "admin" ? "admin" : "cliente";
            sessionStorage.setItem("accessToken", "token_local_" + Date.now());
            sessionStorage.setItem("usuarioLogeado", userLocal.usuario);
            sessionStorage.setItem("rol", rol);

            mostrarMensaje("Inicio de sesión correcto (usuario local).", "success");
            redirigirPorRol(rol);
            return;
        }

        // Si no coincide usuario local, busca con API DummyJSON
        try {
            const resp = await fetch("https://dummyjson.com/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: usuario,
                    password: contraseña
                })
            });

            const data = await resp.json();

            // Verifica si la API devolvió correctamente un token
            if (!resp.ok || !data.accessToken) {
                mostrarMensaje("Credenciales incorrectas.", "danger");
                return;
            }

            // Guarda token y usuario en sessionStorage
            sessionStorage.setItem("accessToken", data.accessToken);
            sessionStorage.setItem("usuarioLogeado", usuario);
            sessionStorage.setItem("rol", "cliente"); // Todos los DummyJSON son "cliente"

            mostrarMensaje("Inicio de sesión correcto. Redirigiendo...", "success");
            redirigirPorRol("cliente");

        } catch (err) {
            console.error("Error login:", err);
            mostrarMensaje("Error al conectar con el servicio de autenticación.", "danger");
        }
    });

    // Muestra un mensaje en pantalla (alerta Bootstrap)
    function mostrarMensaje(mensaje, tipo) {
        if (!alertPlaceholder) return;
        alertPlaceholder.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }

    // Redirige al usuario según su rol
    function redirigirPorRol(rol) {
        setTimeout(() => {
            if (rol === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "index.html";
            }
        }, 1000);
    }
});
