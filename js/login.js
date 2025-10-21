const formularioLogin = document.getElementById("login");
const usuario = document.getElementById("usuario");
const contraseña = document.getElementById("contraseña");
const mensaje = document.getElementById("mensaje")

function mostrarMensaje(texto, tipo){
    
    mensaje.innerHTML = `
        <div id="mensaje" class="mb-3 margin-top-3">
            <div class="alert alert-${tipo}" margin-top-3>${texto}</div>
        </div>
    `;

}

formularioLogin.addEventListener("submit", function(event){
    event.preventDefault();

    let usuarioImput = usuario.value.trim();
    let contraseñaimput = usuario.value.trim();

    const isUsuario = usuarios.find(
        u => u.usuario === usuarioImput && u.contraseña === contraseñaimput
    );

    if(isUsuario){
        sessionStorage.setItem("usuarioLogeado", usuarioImput);
        mostrarMensaje(`Has ingresado correctamente como ${usuario.value}`, "success")
        window.location.href = "altaMedicos.html"
    } else {
        mostrarMensaje("Usuario o contraseña incorrectas", "danger");
    }

})

