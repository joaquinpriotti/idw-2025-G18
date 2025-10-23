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