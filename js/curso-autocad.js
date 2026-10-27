(function () {
  var cabecera = document.querySelector(".cabecera");
  var menu = document.querySelector(".menu-boton");
  if (menu) {
    menu.addEventListener("click", function () {
      var abierto = cabecera.classList.toggle("abierta");
      menu.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
  }

  var enlaces = Array.prototype.slice.call(document.querySelectorAll(".nav a[href^='#']"));
  enlaces.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
      cabecera.classList.remove("abierta");
      if (menu) menu.setAttribute("aria-expanded", "false");
    });
  });

  function marcarSeccion() {
    var marca = window.scrollY + 120;
    var actual = enlaces[0];
    enlaces.forEach(function (enlace) {
      var seccion = document.getElementById(enlace.getAttribute("href").slice(1));
      if (seccion && seccion.offsetTop <= marca) actual = enlace;
    });
    enlaces.forEach(function (enlace) {
      enlace.classList.toggle("activo", enlace === actual);
    });
  }

  if (enlaces.length) {
    marcarSeccion();
    window.addEventListener("scroll", marcarSeccion, { passive: true });
  }

  var curso = window.ARTS && window.ARTS.cursos && window.ARTS.cursos.autocad;
  if (curso) {
    var inicio = document.getElementById("curso-inicio");
    var horario = document.getElementById("curso-horario");
    var precio = document.getElementById("curso-precio");
    if (inicio) inicio.textContent = curso.inicio || curso.inicioCorto;
    if (horario && curso.horario) horario.textContent = curso.horario.replace(" - ", " – ") + " EST";
    if (precio) precio.textContent = curso.inversionTexto;
  }

  var pensum = document.getElementById("descargar-pensum");
  if (pensum) {
    pensum.addEventListener("click", function () {
      var texto = [
        "Arts Digital Institute",
        "Pensum — Curso de AutoCAD",
        "",
        "Dibujo y edición de objetos con precisión.",
        "Trabajo en pies y pulgadas adaptado a estándares de US.",
        "Uso de layers, estilos de texto y organización del proyecto.",
        "Aplicación de hatch y control de grosores de línea.",
        "Dimensionamiento personalizado según normas y necesidades del proyecto.",
        "Creación, edición y gestión de librerías de bloques.",
        "Configuración de layouts, viewports y title blocks para impresión profesional.",
        "Configuración de escalas para impresión de planos exactos.",
        "Exportación a PDF y preparación de entregables listos para clientes y revisión."
      ].join("\n");
      var archivo = new Blob([texto], { type: "text/plain;charset=utf-8" });
      var url = URL.createObjectURL(archivo);
      var enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = "pensum-autocad.txt";
      enlace.click();
      URL.revokeObjectURL(url);
    });
  }

  var reservas = [];
  var form = document.getElementById("form-reserva");
  var aviso = document.getElementById("reserva-aviso");
  if (!form) return;

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();
    var nombre = form.nombre.value.trim();
    var correo = form.correo.value.trim();
    var telefono = form.telefono.value.trim();
    var correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
    form.querySelectorAll(".campo").forEach(function (campo) {
      campo.classList.remove("invalido");
    });
    var valido = true;
    if (!nombre) {
      form.nombre.closest(".campo").classList.add("invalido");
      valido = false;
    }
    if (!correoValido) {
      form.correo.closest(".campo").classList.add("invalido");
      valido = false;
    }
    if (telefono.length < 7) {
      form.telefono.closest(".campo").classList.add("invalido");
      valido = false;
    }
    if (!valido) {
      aviso.textContent = "Revisa el nombre, el correo y el teléfono.";
      return;
    }
    reservas.push({ nombre: nombre, correo: correo, telefono: telefono });
    form.reset();
    aviso.textContent = "Quedó anotado en esta visita. Esta página no cobra los $290 ni envía los datos.";
  });
})();
