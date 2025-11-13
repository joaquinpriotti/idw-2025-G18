// Maneja el inicio de sesión local (usuarios.js) y API DummyJSON
// Guarda el token y el rol del usuario en sessionStorage.

import { usuarios } from './usuarios.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formLogin');
    const mensaje = document.getElementById('mensaje');

    if (!form) return;

    // mostrar mensajes
    function mostrarMensaje(text, tipo = 'info') {
        mensaje.style.display = 'block';
        mensaje.className = 'alert text-center'; // reseteo
        if (tipo === 'success') mensaje.classList.add('alert-success');
        else if (tipo === 'warning') mensaje.classList.add('alert-warning');
        else if (tipo === 'danger') mensaje.classList.add('alert-danger');
        else mensaje.classList.add('alert-info');
        mensaje.textContent = text;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // <- evita el envío por GET y exposición en URL

        const usuario = document.getElementById('usuario').value.trim();
        const contrasena = document.getElementById('contrasena').value.trim();

        if (!usuario || !contrasena) {
            mostrarMensaje('Complete todos los campos.', 'warning');
            return;
        }

        // Comprueba usuarios locales (de usuarios.js)
        const userLocal = usuarios.find(u => {
            const passProp = u.contrasena ?? u.contraseña ?? u.password ?? null;
            return u.usuario === usuario && passProp === contrasena;
        });

        if (userLocal) {
            // Si el objeto local trae rol, usarlo; si no, decidir por nombre
            const rol = userLocal.rol || (usuario === 'admin' ? 'admin' : 'cliente');
            sessionStorage.setItem('accessToken', 'token_local_' + Date.now());
            sessionStorage.setItem('usuarioLogeado', usuario);
            sessionStorage.setItem('rol', rol);
            mostrarMensaje('Inicio de sesión local correcto. Redirigiendo...', 'success');
            return redirigirPorRol(rol);
        }

        // DummyJSON auth/login espera { username, password } y devuelve un token (en su API pública).
        try {
            mostrarMensaje('Intentando iniciar sesión en servidor...', 'info');

            const resp = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: usuario, password: contrasena })
            });

            if (!resp.ok) {
                // muestra mensaje pero no revela detalles
                mostrarMensaje('Usuario o contraseña inválidos (servidor).', 'danger');
                return;
            }

            const data = await resp.json();
            // DummyJSON devuelve un objeto
            const token = data.token || data.accessToken || null;
            if (!token) {
                mostrarMensaje('Respuesta de autenticación inválida.', 'danger');
                return;
            }

            // Guardar token y datos mínimos
            sessionStorage.setItem('accessToken', token);
            sessionStorage.setItem('usuarioLogeado', data.username || usuario);

            // Damos rol "admin" solo si el usuario coincide con "admin" o segun criterio propio.
            const rol = (data.username === 'admin' || usuario === 'admin') ? 'admin' : 'cliente';
            sessionStorage.setItem('rol', rol);

            mostrarMensaje('Login exitoso. Redirigiendo...', 'success');
            return redirigirPorRol(rol);
        } catch (err) {
            console.error('Error fetch login:', err);
            mostrarMensaje('Error al comunicarse con el servidor de autenticación.', 'danger');
        }
    });

    function redirigirPorRol(rol) {
        // "redirigiendo" para que el usuario vea el mensaje
        setTimeout(() => {
            if (rol === 'admin') {
                window.location.href = 'admin.html';
            } else if (rol === 'cliente') {
                window.location.href = 'turnosCliente.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 700);
    }
});
