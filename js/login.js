const formularioLogin = document.getElementById("login");
const usuario = document.getElementById("usuario");
const contraseña = document.getElementById("contraseña");
const mensaje = document.getElementById("mensaje");


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
    let contraseñaimput = contraseña.value.trim();

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

function estaLogeado(){
    const logeado = sessionStorage.getItem("usuarioLogeado");
    const contenedorBoton = document.getElementById("botonDinamico");
    
    if(logeado === "admin" || logeado === "cliente"){
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
}

function cerrarSesion(event){

    event.preventDefault(); 
    
    let logeado = sessionStorage.getItem("usuarioLogeado");

    if(logeado === "admin" || logeado === "cliente"){
        sessionStorage.removeItem("usuarioLogeado");
        window.location.reload();
    }
}
estaLogeado();

