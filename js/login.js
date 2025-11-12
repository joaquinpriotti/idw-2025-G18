const formularioLogin = document.getElementById("login");
const usuarioInput = document.getElementById("usuario");
const contraseñaInput = document.getElementById("contraseña");
const mensaje = document.getElementById("mensaje");

function mostrarMensaje(texto) {
    mensaje.innerHTML = `
        <div id="mensaje" class="mb-3 margin-top-3">
            <div class="alert alert-${tipo}" margin-top-3>${texto}</div>
        </div>
    `;
}

// Login usando DummyJSON
async function loginDummyJSON(usuario, contraseña) {
    const url = "https://dummyjson.com/auth/login";
    const body = {
        username: usuario,
        password: contraseña
    };

    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };

    const resp = await fetch(url, options);
    if (!resp.ok) {
        const text = await resp.text().catch(() => "");
        throw new Error(`Error en login: ${resp.status} ${text}`);
    }
    return resp.json(); // contiene accessToken, usuario, etc.
}

// Submit del formulario
if (formularioLogin) {
    formularioLogin.addEventListener("submit", async (e) => {
        e.preventDefault();

        const usuario = usuarioInput.value.trim();
        const contraseña = contraseñaInput.value.trim();

        if (!usuario || !contraseña) {
            mostrarMensaje("Por favor complete usuario y contraseña.");
            return;
        }

        mostrarMensaje("Intentando iniciar sesión...");

        try {
            // Intentar login en DummyJSON
            const data = await loginDummyJSON(usuario, contraseña);

            // Guardar token en sessionStorage
            if (data && data.accessToken) {
                sessionStorage.setItem("accessToken", data.accessToken);

                // Guardar tambien el user
                sessionStorage.setItem("usuarioLogeado", data.username || usuario);

                // Definimos rol: si username y contraseña === 'admin' => admin
                const rol = (usuario === "admin" && contraseña === "admin") ? "admin" : "cliente";
                sessionStorage.setItem("rol", rol);

                mostrarMensaje("Login exitoso. Redirigiendo...");

                // redirigir según rol (opcional)
                setTimeout(() => {
                    if (rol === "admin") {
                        window.location.href = "admin.html";
                    } else {
                        window.location.href = "index.html";
                    }
                }, 700);
            } else {
                throw new Error("No se recibió accessToken del servidor.");
            }
        } catch (err) {
            console.error("Error en login DummyJSON:", err);

            // --- Fallback local para desarrollo ---
            // Si no podés acceder a DummyJSON, usa el array local `usuarios` en js/usuarios.js
            try {
                // usuarios definidos en js/usuarios.js
                if (typeof usuarios !== "undefined" && Array.isArray(usuarios)) {
                    const found = usuarios.find(u => u.usuario === usuario && u.contraseña === contraseña);
                    if (found) {
                        // Simular token y rol
                        sessionStorage.setItem("accessToken", "token-local-de-prueba");
                        sessionStorage.setItem("usuarioLogeado", usuario);
                        const rol = (usuario === "admin" && contraseña === "admin") ? "admin" : "cliente";
                        sessionStorage.setItem("rol", rol);
                        mostrarMensaje("Login (local) exitoso. Redirigiendo...");
                        setTimeout(() => {
                            if (rol === "admin") window.location.href = "admin.html";
                            else window.location.href = "index.html";
                        }, 600);
                        return;
                    }
                }
            } catch (fallbackErr) {
                console.warn("Fallback local falló:", fallbackErr);
            }

            // Si todo falla, muestra error
            mostrarMensaje("Credenciales inválidas o servicio de autenticación no disponible.");
        }
    });
}

// función para cerrar sesión (puede ser usada desde el nav)
function cerrarSesion(event) {
    if (event) event.preventDefault();
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("usuarioLogeado");
    sessionStorage.removeItem("rol");
    // recargar para que el menú cambie
    window.location.reload();
}
