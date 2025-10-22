let logeado = sessionStorage.getItem("usuarioLogeado");

if(logeado === "admin"){
    alert("Bienvenido admin");
} else {
    alert("Lo sentimos, no posee privilegios para acceder a esta sección");
    window.location.href = "login.html";
}