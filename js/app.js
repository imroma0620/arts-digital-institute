(function () {
  var datos = window.ARTS;
  var carrito = [];
  var solicitud = null;
  var carruseles = [];
  var dialog = document.getElementById("panel");
  var panelTitulo = document.getElementById("panel-titulo");
  var panelCuerpo = document.getElementById("panel-cuerpo");

  function aviso(texto) {
    document.getElementById("avisos").textContent = texto;
  }

  function dinero(valor) {
    var partes = valor.toFixed(2).split(".");
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return "$" + partes.join(".") + " USD";
  }

  function icono(trazos) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    trazos.forEach(function (d) {
      var path = document.createElementNS(ns, "path");
      path.setAttribute("d", d);
      svg.appendChild(path);
    });
    return svg;
  }

  function punto(acento) {
    var marca = document.createElement("span");
    marca.className = "punto";
    marca.dataset.acento = acento;
    marca.setAttribute("aria-hidden", "true");
    return marca;
  }

  function slide(nodo) {
    var item = document.createElement("div");
    item.className = "carrusel-item";
    item.appendChild(nodo);
    return item;
  }

  function botonCurso(id, atributo, texto, secundario) {
    var boton = document.createElement("button");
    boton.type = "button";
    boton.className = secundario ? "boton boton-secundario" : "boton";
    boton.setAttribute(atributo, id);
    boton.textContent = texto;
    return boton;
  }

  function parDato(etiqueta, valor) {
    var fragmento = document.createDocumentFragment();
    var micro = document.createElement("p");
    micro.className = "micro";
    micro.textContent = etiqueta;
    var dato = document.createElement("p");
    dato.className = "dato";
    dato.textContent = valor;
    fragmento.append(micro, dato);
    return fragmento;
  }

  function filaFicha(dl, etiqueta, valor) {
    if (!valor) return;
    var grupo = document.createElement("div");
    var dt = document.createElement("dt");
    dt.textContent = etiqueta;
    var dd = document.createElement("dd");
    dd.textContent = valor;
    grupo.append(dt, dd);
    dl.appendChild(grupo);
  }

  function enCarrito(id) {
    return carrito.some(function (item) { return item.id === id; });
  }

  function sincronizarBotones() {
    document.querySelectorAll("[data-inscribir], [data-reservar]").forEach(function (boton) {
      var id = boton.getAttribute("data-inscribir") || boton.getAttribute("data-reservar");
      var dentro = enCarrito(id);
      boton.setAttribute("aria-pressed", dentro ? "true" : "false");
      if (boton.hasAttribute("data-inscribir")) {
        boton.textContent = dentro ? "En el carrito" : "Inscribirme";
      } else {
        boton.textContent = dentro ? "En el carrito" : "Reservar cupo";
      }
    });
  }

  function actualizarCuenta() {
    var badge = document.querySelector(".carrito-cuenta");
    var boton = document.querySelector("[data-panel='carrito']");
    if (!carrito.length) {
      badge.hidden = true;
      badge.textContent = "0";
      boton.setAttribute("aria-label", "Carrito");
      return;
    }
    badge.hidden = false;
    badge.textContent = String(carrito.length);
    boton.setAttribute("aria-label", "Carrito, " + carrito.length + (carrito.length === 1 ? " curso" : " cursos"));
  }

  function pintarAreas(pista) {
    datos.areas.forEach(function (area) {
      var articulo = document.createElement("article");
      articulo.className = "tarjeta tarjeta-area";
      articulo.dataset.acento = area.acento;
      var foto = document.createElement("img");
      foto.src = area.imagen;
      foto.alt = "";
      var titulo = document.createElement("h3");
      titulo.textContent = area.nombre;
      articulo.append(foto, titulo);
      pista.appendChild(slide(articulo));
    });
  }

  function pintarLanzamientos(pista) {
    datos.lanzamientos.forEach(function (id) {
      var curso = datos.cursos[id];
      var articulo = document.createElement("article");
      articulo.className = "tarjeta tarjeta-curso";
      var etiqueta = document.createElement("p");
      etiqueta.className = "etiqueta";
      etiqueta.append(punto(curso.acento), document.createTextNode(curso.categoria));
      var titulo = document.createElement("h3");
      titulo.textContent = curso.nombreCorto || curso.nombre;
      articulo.append(etiqueta, titulo, parDato("Próximo inicio", curso.inicioCorto), parDato("Inversión", curso.inversionTexto));
      var acciones = document.createElement("div");
      acciones.className = "acciones";
      acciones.append(botonCurso(id, "data-inscribir", "Inscribirme", false), botonCurso(id, "data-detalle", "Saber más →", true));
      articulo.appendChild(acciones);
      pista.appendChild(slide(articulo));
    });
  }

  function partesInicio(inicio) {
    var coincidencia = String(inicio || "").match(/^(\S+)\s+(\d+)\s+de\s+(.+)$/);
    if (!coincidencia) return { semana: "", dia: inicio, mes: "" };
    return {
      semana: coincidencia[1],
      dia: String(Number(coincidencia[2])),
      mes: coincidencia[3]
    };
  }

  function pintarCalendario(raiz) {
    var agenda = document.createElement("div");
    agenda.className = "agenda";
    datos.calendario.forEach(function (grupo) {
      var bloque = document.createElement("section");
      bloque.className = "agenda-grupo";
      var encabezado = document.createElement("h3");
      encabezado.className = "agenda-grupo-titulo";
      encabezado.append(punto(grupo.acento), document.createTextNode(grupo.nombre));
      bloque.appendChild(encabezado);

      grupo.cursos.forEach(function (id) {
        var curso = datos.cursos[id];
        var partes = curso.nombre.split(" — ");
        var tituloTexto = curso.nombreCorto || partes[0];
        var detalleTexto = partes.length > 1 ? partes.slice(1).join(" — ") : "";
        var fecha = partesInicio(curso.inicio);
        var ficha = document.createElement("article");
        ficha.className = "agenda-curso";

        var marca = document.createElement("div");
        marca.className = "cal-icono";
        marca.setAttribute("role", "img");
        marca.setAttribute("aria-label", curso.inicio);
        var mes = document.createElement("span");
        mes.className = "cal-icono-mes";
        mes.textContent = fecha.mes.slice(0, 3);
        var dia = document.createElement("span");
        dia.className = "cal-icono-dia";
        dia.textContent = fecha.dia;
        var semana = document.createElement("span");
        semana.className = "cal-icono-semana";
        semana.textContent = fecha.semana.slice(0, 3);
        marca.append(mes, dia, semana);

        var copia = document.createElement("div");
        copia.className = "agenda-copia";
        var titulo = document.createElement("h4");
        titulo.textContent = tituloTexto;
        copia.appendChild(titulo);
        if (detalleTexto) {
          var detalle = document.createElement("p");
          detalle.className = "agenda-detalle";
          detalle.textContent = detalleTexto;
          copia.appendChild(detalle);
        }
        var hora = document.createElement("p");
        hora.className = "agenda-hora";
        hora.textContent = curso.horario.replace(" - ", " – ") + " EST";
        copia.appendChild(hora);

        var lado = document.createElement("div");
        lado.className = "agenda-lado";
        var precio = document.createElement("p");
        precio.className = "agenda-precio";
        precio.textContent = curso.inversionTexto;
        var detalles = botonCurso(id, "data-detalle", "Ver detalles", true);
        detalles.className = "enlace agenda-detalles";
        lado.append(precio, botonCurso(id, "data-reservar", "Reservar cupo", false), detalles);

        ficha.append(marca, copia, lado);
        bloque.appendChild(ficha);
      });
      agenda.appendChild(bloque);
    });
    raiz.appendChild(agenda);
  }

  function pintarFormacion(raiz) {
    datos.formacion.forEach(function (id) {
      var curso = datos.cursos[id];
      var articulo = document.createElement("article");
      articulo.className = "tarjeta tarjeta-formacion";
      articulo.dataset.acento = curso.acento;
      var sigla = document.createElement("p");
      sigla.className = "sigla";
      sigla.textContent = curso.sigla;
      var titulo = document.createElement("h3");
      titulo.textContent = curso.nombre;
      var texto = document.createElement("p");
      texto.className = "texto";
      texto.textContent = curso.texto;
      articulo.append(sigla, titulo, texto, botonCurso(id, "data-detalle", "Explorar curso →", true));
      raiz.appendChild(articulo);
    });
  }

  function pintarBim(raiz) {
    var bim = datos.bim;
    var cabecera = document.createElement("header");
    cabecera.className = "seccion-cabecera info-cabecera";
    var etiqueta = document.createElement("p");
    etiqueta.className = "etiqueta";
    etiqueta.textContent = bim.etiqueta;
    var titulo = document.createElement("h2");
    titulo.textContent = bim.titulo;
    var texto = document.createElement("p");
    texto.className = "subtitulo";
    texto.textContent = bim.texto;
    cabecera.append(etiqueta, titulo, texto);

    var frases = [
      "Del concepto a la construcción, con control de tiempos y recursos.",
      "Equipos coordinados en la nube, sin conflictos en obra.",
      "Norma ISO 19650 para trabajar en cualquier lugar."
    ];
    var acentos = ["manufactura", "ingenieria", "bim"];
    var figuras = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="3.2" width="19" height="12.2" rx="1.5" stroke="#fff" stroke-width="1.6"/><path d="M8 20.2h8M12 15.4v4.8" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M5.8 6.6h3.6l1.2 1.3H18.2v5.2H5.8z" fill="#fff"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2.5" y="7" width="12.5" height="10" rx="1.6" stroke="#fff" stroke-width="1.6"/><path d="M15 10.4l6.5-3.2v9.6L15 13.6z" fill="#fff"/></svg>',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><g transform="translate(1.5 5)"><rect width="21" height="14" rx="1" fill="#B22234"/><rect y="2" width="21" height="1.55" fill="#fff"/><rect y="5.1" width="21" height="1.55" fill="#fff"/><rect y="8.2" width="21" height="1.55" fill="#fff"/><rect y="11.3" width="21" height="1.55" fill="#fff"/><rect width="9.2" height="7.6" fill="#3C3B6E"/><circle cx="1.8" cy="1.6" r="0.42" fill="#fff"/><circle cx="3.6" cy="1.6" r="0.42" fill="#fff"/><circle cx="5.4" cy="1.6" r="0.42" fill="#fff"/><circle cx="7.2" cy="1.6" r="0.42" fill="#fff"/><circle cx="2.7" cy="3.2" r="0.42" fill="#fff"/><circle cx="4.5" cy="3.2" r="0.42" fill="#fff"/><circle cx="6.3" cy="3.2" r="0.42" fill="#fff"/><circle cx="1.8" cy="4.8" r="0.42" fill="#fff"/><circle cx="3.6" cy="4.8" r="0.42" fill="#fff"/><circle cx="5.4" cy="4.8" r="0.42" fill="#fff"/><circle cx="7.2" cy="4.8" r="0.42" fill="#fff"/></g></svg>'
    ];

    var lista = document.createElement("ol");
    lista.className = "info-riel";
    bim.puntos.forEach(function (item, indice) {
      var paso = document.createElement("li");
      paso.className = "info-nodo";
      var circulo = document.createElement("div");
      circulo.className = "info-circulo";
      circulo.dataset.acento = acentos[indice];
      var doc = new DOMParser().parseFromString(figuras[indice], "image/svg+xml");
      circulo.appendChild(document.importNode(doc.documentElement, true));
      var tallo = document.createElement("span");
      tallo.className = "info-tallo";
      tallo.setAttribute("aria-hidden", "true");
      var puntoLinea = document.createElement("span");
      puntoLinea.className = "info-punto";
      puntoLinea.setAttribute("aria-hidden", "true");
      var h = document.createElement("h3");
      h.textContent = item.titulo;
      var p = document.createElement("p");
      p.textContent = frases[indice];
      paso.append(circulo, tallo, puntoLinea, h, p);
      lista.appendChild(paso);
    });

    var cta = document.createElement("a");
    cta.className = "boton";
    cta.href = "#calendario";
    cta.textContent = bim.cta;
    raiz.append(cabecera, lista, cta);
  }

  function crearCarrusel(raiz) {
    var bloque = raiz.closest("[data-bloque]");
    var ventana = document.createElement("div");
    ventana.className = "carrusel-ventana";
    var pista = document.createElement("div");
    pista.className = "carrusel-pista";
    ventana.appendChild(pista);
    raiz.appendChild(ventana);
    var anuncio = document.createElement("p");
    anuncio.className = "sr";
    anuncio.setAttribute("aria-live", "polite");
    raiz.appendChild(anuncio);

    var estado = {
      indice: 0,
      arrastrando: false,
      inicioX: 0,
      inicioY: 0,
      delta: 0,
      eje: null,
      puntero: null
    };

    function visibles() {
      var ancho = ventana.clientWidth;
      if (ancho < 760) return 1;
      if (ancho < 1040) return 2;
      return 3;
    }

    function limite() {
      return Math.max(0, Math.ceil(pista.children.length / visibles()) - 1);
    }

    function actualizar(anunciar) {
      if (!ventana.clientWidth || !pista.children.length) return;
      var cantidad = visibles();
      var ancho = ventana.clientWidth / cantidad;
      for (var i = 0; i < pista.children.length; i++) {
        pista.children[i].style.flexBasis = ancho + "px";
        pista.children[i].style.width = ancho + "px";
      }
      if (estado.indice < 0) estado.indice = 0;
      if (estado.indice > limite()) estado.indice = limite();
      var desplazamiento = estado.arrastrando && estado.eje === "x" ? estado.delta : 0;
      pista.style.transform = "translateX(" + (-estado.indice * ventana.clientWidth + desplazamiento) + "px)";
      bloque.querySelectorAll("[data-dir]").forEach(function (boton) {
        var direccion = Number(boton.getAttribute("data-dir"));
        var apagado = direccion < 0 ? estado.indice <= 0 : estado.indice >= limite();
        boton.disabled = apagado;
      });
      if (anunciar) {
        anuncio.textContent = "Grupo " + (estado.indice + 1) + " de " + (limite() + 1);
      }
    }

    function mover(direccion) {
      estado.indice += direccion;
      actualizar(true);
    }

    bloque.querySelectorAll("[data-dir]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        mover(Number(boton.getAttribute("data-dir")));
      });
    });

    bloque.addEventListener("keydown", function (evento) {
      if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
      if (evento.target.closest("input, textarea")) return;
      evento.preventDefault();
      mover(evento.key === "ArrowRight" ? 1 : -1);
    });

    ventana.addEventListener("pointerdown", function (evento) {
      if (evento.target.closest("button, a")) return;
      estado.arrastrando = true;
      estado.inicioX = evento.clientX;
      estado.inicioY = evento.clientY;
      estado.delta = 0;
      estado.eje = null;
      estado.puntero = evento.pointerId;
    });

    ventana.addEventListener("pointermove", function (evento) {
      if (!estado.arrastrando || evento.pointerId !== estado.puntero) return;
      var dx = evento.clientX - estado.inicioX;
      var dy = evento.clientY - estado.inicioY;
      if (!estado.eje) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        estado.eje = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (estado.eje === "y") {
          estado.arrastrando = false;
          return;
        }
        ventana.setPointerCapture(evento.pointerId);
        pista.classList.add("arrastrando");
        ventana.classList.add("arrastrando");
      }
      if (estado.eje !== "x") return;
      evento.preventDefault();
      estado.delta = dx;
      actualizar(false);
    }, { passive: false });

    function soltar(evento) {
      if (estado.puntero !== null && evento.pointerId !== estado.puntero) return;
      var movio = estado.eje === "x";
      if (!estado.arrastrando && !movio) {
        estado.eje = null;
        estado.puntero = null;
        return;
      }
      if (movio) {
        if (estado.delta < -48) estado.indice += 1;
        if (estado.delta > 48) estado.indice -= 1;
      }
      estado.arrastrando = false;
      estado.delta = 0;
      estado.eje = null;
      estado.puntero = null;
      pista.classList.remove("arrastrando");
      ventana.classList.remove("arrastrando");
      actualizar(movio);
    }

    ventana.addEventListener("pointerup", soltar);
    ventana.addEventListener("pointercancel", soltar);
    window.addEventListener("pointerup", soltar);
    window.addEventListener("pointercancel", soltar);

    return {
      pista: pista,
      actualizar: function () { actualizar(false); }
    };
  }

  function cerrarMenu() {
    document.querySelector(".cabecera").classList.remove("abierta");
    document.querySelector(".menu-boton").setAttribute("aria-expanded", "false");
  }

  function alternarMenu() {
    var cabecera = document.querySelector(".cabecera");
    var abierto = cabecera.classList.toggle("abierta");
    document.querySelector(".menu-boton").setAttribute("aria-expanded", abierto ? "true" : "false");
  }

  function abrirPanel(tipo, titulo, construir) {
    cerrarMenu();
    dialog.dataset.tipo = tipo;
    panelTitulo.textContent = titulo;
    panelCuerpo.replaceChildren();
    construir(panelCuerpo);
    if (!dialog.open) dialog.showModal();
  }

  function abrirCarrito() {
    abrirPanel("carrito", "Carrito", function (cuerpo) {
      if (!carrito.length) {
        var vacio = document.createElement("p");
        vacio.textContent = "Todavía no hay cursos en el carrito.";
        cuerpo.appendChild(vacio);
        return;
      }
      var lista = document.createElement("ul");
      lista.className = "carrito-lista";
      carrito.forEach(function (item) {
        var li = document.createElement("li");
        var info = document.createElement("div");
        info.className = "curso-datos";
        var nombre = document.createElement("p");
        nombre.className = "nombre-curso";
        nombre.textContent = item.nombre;
        info.appendChild(nombre);
        if (item.detalle && item.detalle !== item.nombre) {
          var detalle = document.createElement("p");
          detalle.textContent = item.detalle;
          info.appendChild(detalle);
        }
        var precio = document.createElement("p");
        precio.className = "dato";
        precio.textContent = item.inversionTexto;
        info.appendChild(precio);
        var quitar = document.createElement("button");
        quitar.type = "button";
        quitar.className = "boton boton-secundario";
        quitar.setAttribute("data-quitar", item.id);
        quitar.textContent = "Quitar";
        li.append(info, quitar);
        lista.appendChild(li);
      });
      var totalValor = carrito.reduce(function (suma, item) { return suma + item.inversion; }, 0);
      var total = document.createElement("p");
      total.className = "dato total";
      total.textContent = "Total: " + dinero(totalValor);
      var nota = document.createElement("p");
      nota.className = "nota-carrito";
      nota.textContent = "Reservar un cupo lo deja en esta lista. El pago no está conectado.";
      cuerpo.append(lista, total, nota);
    });
  }

  function agregar(id) {
    var curso = datos.cursos[id];
    var visible = curso.nombreCorto || curso.nombre;
    if (enCarrito(id)) {
      aviso(visible + " ya está en el carrito.");
      abrirCarrito();
      return;
    }
    carrito.push({
      id: id,
      nombre: visible,
      detalle: curso.nombre,
      inversion: curso.inversion,
      inversionTexto: curso.inversionTexto
    });
    sincronizarBotones();
    actualizarCuenta();
    aviso(visible + " se agregó al carrito.");
    abrirCarrito();
  }

  function quitar(id) {
    carrito = carrito.filter(function (item) { return item.id !== id; });
    sincronizarBotones();
    actualizarCuenta();
    aviso("Se quitó el curso del carrito.");
    if (dialog.open && dialog.dataset.tipo === "carrito") abrirCarrito();
  }

  function abrirDetalle(id) {
    var curso = datos.cursos[id];
    abrirPanel("detalle", curso.nombre, function (cuerpo) {
      if (curso.categoria) {
        var etiqueta = document.createElement("p");
        etiqueta.className = "etiqueta";
        etiqueta.append(punto(curso.acento), document.createTextNode(curso.categoria));
        cuerpo.appendChild(etiqueta);
      }
      if (curso.texto) {
        var texto = document.createElement("p");
        texto.textContent = curso.texto;
        cuerpo.appendChild(texto);
      }
      var ficha = document.createElement("dl");
      ficha.className = "ficha";
      filaFicha(ficha, "Próximo inicio", curso.inicio || curso.inicioCorto);
      filaFicha(ficha, "Horario (EST)", curso.horario);
      filaFicha(ficha, "Inversión", curso.inversionTexto);
      if (ficha.children.length) cuerpo.appendChild(ficha);
      if (curso.inversionTexto) {
        var boton = botonCurso(id, "data-inscribir", enCarrito(id) ? "En el carrito" : "Inscribirme", false);
        boton.classList.add("boton-bloque");
        if (enCarrito(id)) boton.setAttribute("aria-pressed", "true");
        cuerpo.appendChild(boton);
      }
    });
  }

  function campo(formulario, id, etiqueta, tipo) {
    var envoltura = document.createElement("div");
    envoltura.className = "campo";
    var label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = etiqueta;
    var input = tipo === "textarea" ? document.createElement("textarea") : document.createElement("input");
    if (tipo !== "textarea") input.type = tipo;
    input.id = id;
    input.name = id;
    var error = document.createElement("p");
    error.className = "error-campo";
    error.id = id + "-error";
    error.hidden = true;
    input.setAttribute("aria-describedby", error.id);
    envoltura.append(label, input, error);
    formulario.appendChild(envoltura);
    return { envoltura: envoltura, input: input, error: error };
  }

  function marcar(control, mensaje) {
    if (mensaje) {
      control.envoltura.classList.add("invalido");
      control.input.setAttribute("aria-invalid", "true");
      control.error.hidden = false;
      control.error.textContent = mensaje;
      return false;
    }
    control.envoltura.classList.remove("invalido");
    control.input.removeAttribute("aria-invalid");
    control.error.hidden = true;
    control.error.textContent = "";
    return true;
  }

  function correoValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  function pintarSolicitud(cuerpo) {
    var confirmacion = document.createElement("p");
    confirmacion.className = "dato";
    confirmacion.textContent = "Tu solicitud quedó armada en esta sesión. No se envió ningún correo.";
    var ficha = document.createElement("dl");
    ficha.className = "ficha";
    filaFicha(ficha, "Nombre", solicitud.nombre);
    filaFicha(ficha, "Correo", solicitud.correo);
    filaFicha(ficha, "Mensaje", solicitud.mensaje);
    cuerpo.append(confirmacion, ficha);
  }

  function abrirAsesor() {
    abrirPanel("asesor", "Hablar con un asesor", function (cuerpo) {
      if (solicitud) {
        pintarSolicitud(cuerpo);
        return;
      }
      var formulario = document.createElement("form");
      formulario.noValidate = true;
      var nombre = campo(formulario, "asesor-nombre", "Nombre", "text");
      nombre.input.autocomplete = "name";
      var correo = campo(formulario, "asesor-correo", "Correo", "email");
      correo.input.autocomplete = "email";
      var mensaje = campo(formulario, "asesor-mensaje", "Mensaje", "textarea");
      var enviar = document.createElement("button");
      enviar.type = "submit";
      enviar.className = "boton boton-bloque";
      enviar.textContent = "Enviar";
      formulario.appendChild(enviar);
      formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        var nombreOk = marcar(nombre, nombre.input.value.trim() ? "" : "Escribe tu nombre.");
        var correoOk = marcar(correo, correoValido(correo.input.value.trim()) ? "" : "Escribe un correo válido.");
        var mensajeOk = marcar(mensaje, mensaje.input.value.trim() ? "" : "Escribe tu mensaje.");
        if (!nombreOk || !correoOk || !mensajeOk) {
          (nombreOk ? (correoOk ? mensaje.input : correo.input) : nombre.input).focus();
          return;
        }
        solicitud = {
          nombre: nombre.input.value.trim(),
          correo: correo.input.value.trim(),
          mensaje: mensaje.input.value.trim()
        };
        aviso("La solicitud quedó armada en esta sesión. No se envió ningún correo.");
        abrirAsesor();
      });
      cuerpo.appendChild(formulario);
    });
  }

  function abrirLogin() {
    abrirPanel("login", "Login", function (cuerpo) {
      var nota = document.createElement("p");
      nota.textContent = "Todavía no hay un sistema de usuarios.";
      var formulario = document.createElement("form");
      formulario.noValidate = true;
      var correo = campo(formulario, "login-correo", "Correo", "email");
      correo.input.autocomplete = "username";
      var clave = campo(formulario, "login-clave", "Contraseña", "password");
      clave.input.autocomplete = "current-password";
      var entrar = document.createElement("button");
      entrar.type = "submit";
      entrar.className = "boton boton-bloque";
      entrar.textContent = "Entrar";
      var resultado = document.createElement("p");
      resultado.className = "dato";
      resultado.hidden = true;
      formulario.appendChild(entrar);
      formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        var correoOk = marcar(correo, correoValido(correo.input.value.trim()) ? "" : "Escribe un correo válido.");
        var claveOk = marcar(clave, clave.input.value.trim() ? "" : "Escribe tu contraseña.");
        resultado.hidden = true;
        if (!correoOk || !claveOk) {
          (correoOk ? clave.input : correo.input).focus();
          return;
        }
        resultado.hidden = false;
        resultado.textContent = "No se inició sesión. Todavía no hay un sistema de usuarios.";
        aviso("No se inició sesión. Todavía no hay un sistema de usuarios.");
      });
      cuerpo.append(nota, formulario, resultado);
    });
  }

  function abrirLegal(titulo) {
    abrirPanel("legal", titulo, function () {});
  }

  function armarCatalogo() {
    var lineas = [
      "Arts Digital Institute",
      "Catálogo de cursos",
      "Autodesk Authorized Training Center. Florida, USA.",
      ""
    ];
    datos.catalogo.forEach(function (id) {
      var curso = datos.cursos[id];
      lineas.push(curso.nombre);
      if (curso.categoria) lineas.push("Categoría: " + curso.categoria);
      if (curso.inicio || curso.inicioCorto) lineas.push("Próximo inicio: " + (curso.inicio || curso.inicioCorto));
      if (curso.horario) lineas.push("Horario (EST): " + curso.horario);
      if (curso.inversionTexto) lineas.push("Inversión: " + curso.inversionTexto);
      if (curso.texto) lineas.push(curso.texto);
      lineas.push("");
    });
    return lineas.join("\r\n");
  }

  function descargarCatalogo() {
    var blob = new Blob(["\uFEFF" + armarCatalogo()], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "catalogo-arts.txt";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
    aviso("Se descargó el catálogo.");
  }

  function iniciarBanners() {
    var raiz = document.getElementById("inicio");
    var pista = raiz.querySelector(".banners-pista");
    var ventana = raiz.querySelector(".banners-ventana");
    var slides = raiz.querySelectorAll(".banner");
    var puntos = raiz.querySelectorAll("[data-banner]");
    var avisoBanner = document.getElementById("banners-aviso");
    var titulos = ["Cursos certificados", "Nuevos lanzamientos", "Futuro con BIM"];
    var indice = 0;
    var temporizador = 0;
    var pausado = false;
    var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var espera = 7000;
    var estado = { arrastrando: false, eje: null, inicioX: 0, inicioY: 0, delta: 0, puntero: null };

    function colocar(extra, conTransicion) {
      pista.classList.toggle("arrastrando", !conTransicion);
      pista.style.transform = "translateX(calc(" + (-indice * 100) + "% + " + (extra || 0) + "px))";
    }

    function marcar(anunciar) {
      slides.forEach(function (slide, i) {
        var activo = i === indice;
        slide.classList.toggle("activa", activo);
        slide.setAttribute("aria-hidden", activo ? "false" : "true");
        slide.inert = !activo;
      });
      puntos.forEach(function (punto, i) {
        var activo = i === indice;
        punto.classList.toggle("activo", activo);
        punto.setAttribute("aria-selected", activo ? "true" : "false");
        if (activo) {
          punto.classList.remove("activo");
          void punto.offsetWidth;
          punto.classList.add("activo");
        }
      });
      raiz.dataset.tema = indice === 1 ? "claro" : "oscuro";
      if (anunciar) avisoBanner.textContent = "Banner " + (indice + 1) + " de 3, " + titulos[indice];
    }

    function programar() {
      window.clearTimeout(temporizador);
      if (pausado || reducido) return;
      temporizador = window.setTimeout(function () {
        ir(indice + 1, false);
      }, espera);
    }

    function ir(n, anunciar) {
      var total = slides.length;
      indice = (n + total) % total;
      estado.delta = 0;
      estado.arrastrando = false;
      colocar(0, true);
      marcar(anunciar);
      programar();
    }

    function pausar(valor) {
      pausado = valor;
      raiz.classList.toggle("pausado", valor);
      if (valor) {
        window.clearTimeout(temporizador);
        return;
      }
      marcar(false);
      programar();
    }

    puntos.forEach(function (punto) {
      punto.addEventListener("click", function () {
        ir(Number(punto.getAttribute("data-banner")), true);
      });
    });
    raiz.querySelector("[data-banner-prev]").addEventListener("click", function () {
      ir(indice - 1, true);
    });
    raiz.querySelector("[data-banner-next]").addEventListener("click", function () {
      ir(indice + 1, true);
    });

    raiz.addEventListener("keydown", function (evento) {
      if (evento.key !== "ArrowRight" && evento.key !== "ArrowLeft") return;
      if (evento.target.closest("input, textarea")) return;
      evento.preventDefault();
      evento.stopPropagation();
      ir(indice + (evento.key === "ArrowRight" ? 1 : -1), true);
    });

    raiz.addEventListener("pointerenter", function (evento) {
      if (evento.pointerType === "mouse") pausar(true);
    });
    raiz.addEventListener("pointerleave", function (evento) {
      if (evento.pointerType === "mouse") pausar(false);
    });
    raiz.addEventListener("focusin", function () { pausar(true); });
    raiz.addEventListener("focusout", function (evento) {
      if (!raiz.contains(evento.relatedTarget)) pausar(false);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pausar(true);
      else if (!raiz.matches(":hover") && !raiz.contains(document.activeElement)) pausar(false);
    });

    ventana.addEventListener("pointerdown", function (evento) {
      if (evento.target.closest("a, button")) return;
      estado.arrastrando = true;
      estado.eje = null;
      estado.delta = 0;
      estado.inicioX = evento.clientX;
      estado.inicioY = evento.clientY;
      estado.puntero = evento.pointerId;
      raiz.classList.add("arrastrando");
    });

    ventana.addEventListener("pointermove", function (evento) {
      if (!estado.arrastrando || evento.pointerId !== estado.puntero) return;
      var dx = evento.clientX - estado.inicioX;
      var dy = evento.clientY - estado.inicioY;
      if (!estado.eje) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        estado.eje = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (estado.eje === "y") {
          estado.arrastrando = false;
          estado.puntero = null;
          raiz.classList.remove("arrastrando");
          return;
        }
        pausar(true);
        ventana.setPointerCapture(evento.pointerId);
      }
      if (estado.eje !== "x") return;
      evento.preventDefault();
      estado.delta = dx;
      colocar(dx, false);
    }, { passive: false });

    function soltar(evento) {
      if (estado.puntero === null || evento.pointerId !== estado.puntero) return;
      var movio = estado.eje === "x";
      var delta = estado.delta;
      estado.arrastrando = false;
      estado.eje = null;
      estado.delta = 0;
      estado.puntero = null;
      raiz.classList.remove("arrastrando");
      if (movio && delta < -50) ir(indice + 1, true);
      else if (movio && delta > 50) ir(indice - 1, true);
      else colocar(0, true);
      if (!raiz.matches(":hover") && !raiz.contains(document.activeElement)) pausar(false);
    }

    ventana.addEventListener("pointerup", soltar);
    ventana.addEventListener("pointercancel", soltar);
    window.addEventListener("pointerup", soltar);
    window.addEventListener("pointercancel", soltar);

    marcar(false);
    programar();
  }

  function iniciarCinta() {
    var ventana = document.querySelector(".atributos-ventana");
    var lista = document.getElementById("cinta-atributos");
    if (!ventana || !lista) return;
    var cantidad = lista.children.length;
    Array.prototype.forEach.call(lista.children, function (item) {
      var copia = item.cloneNode(true);
      copia.setAttribute("aria-hidden", "true");
      lista.appendChild(copia);
    });
    var offset = 0;
    var pausa = false;
    var arrastre = null;
    var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var velocidad = 0.51;

    function anchoOriginal() {
      var total = 0;
      for (var i = 0; i < cantidad; i++) total += lista.children[i].getBoundingClientRect().width;
      return total;
    }

    function normalizar() {
      var ancho = anchoOriginal();
      if (!ancho) return;
      while (offset <= -ancho) offset += ancho;
      while (offset > 0) offset -= ancho;
    }

    function pintar() {
      normalizar();
      lista.style.transform = "translateX(" + offset + "px)";
    }

    function frame() {
      if (!pausa && !arrastre) offset -= velocidad;
      pintar();
      window.requestAnimationFrame(frame);
    }

    ventana.addEventListener("pointerenter", function (evento) {
      if (evento.pointerType === "mouse") pausa = true;
    });
    ventana.addEventListener("pointerleave", function (evento) {
      if (evento.pointerType === "mouse" && !arrastre) pausa = false;
    });

    ventana.addEventListener("pointerdown", function (evento) {
      if (evento.target.closest("button, a")) return;
      arrastre = { id: evento.pointerId, x: evento.clientX, y: evento.clientY, base: offset, eje: null };
      ventana.classList.add("arrastrando");
      pausa = true;
    });

    ventana.addEventListener("pointermove", function (evento) {
      if (!arrastre || evento.pointerId !== arrastre.id) return;
      var dx = evento.clientX - arrastre.x;
      var dy = evento.clientY - arrastre.y;
      if (!arrastre.eje) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        arrastre.eje = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (arrastre.eje === "y") {
          arrastre = null;
          ventana.classList.remove("arrastrando");
          if (!ventana.matches(":hover")) pausa = false;
          return;
        }
        ventana.setPointerCapture(evento.pointerId);
      }
      if (arrastre.eje !== "x") return;
      evento.preventDefault();
      offset = arrastre.base + dx;
      pintar();
    }, { passive: false });

    function soltar(evento) {
      if (!arrastre || evento.pointerId !== arrastre.id) return;
      arrastre = null;
      ventana.classList.remove("arrastrando");
      if (!ventana.matches(":hover")) pausa = false;
    }

    ventana.addEventListener("pointerup", soltar);
    ventana.addEventListener("pointercancel", soltar);

    document.querySelectorAll("[data-cinta]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        var paso = lista.children[0].getBoundingClientRect().width;
        offset += paso * Number(boton.getAttribute("data-cinta")) * -1;
        pintar();
      });
    });

    window.addEventListener("resize", pintar);
    if (reducido) pintar();
    else window.requestAnimationFrame(frame);
  }

  function iniciar() {
    iniciarBanners();
    iniciarCinta();
    var areas = crearCarrusel(document.getElementById("carrusel-areas"));
    var lanzamientos = crearCarrusel(document.getElementById("carrusel-lanzamientos"));
    carruseles.push(areas, lanzamientos);
    pintarAreas(areas.pista);
    pintarLanzamientos(lanzamientos.pista);
    pintarCalendario(document.getElementById("lista-calendario"));
    pintarFormacion(document.getElementById("lista-formacion"));
    pintarBim(document.getElementById("bim-contenido"));
    sincronizarBotones();
    actualizarCuenta();
    requestAnimationFrame(function () {
      carruseles.forEach(function (carrusel) { carrusel.actualizar(); });
    });

    document.querySelector("[data-cerrar]").addEventListener("click", function () {
      dialog.close();
    });
    dialog.addEventListener("click", function (evento) {
      if (evento.target === dialog) dialog.close();
    });

    document.addEventListener("click", function (evento) {
      if (evento.target.closest(".menu-boton")) {
        alternarMenu();
        return;
      }
      if (evento.target.closest(".nav a, .nav button")) cerrarMenu();

      var inscribir = evento.target.closest("[data-inscribir]");
      if (inscribir) {
        agregar(inscribir.getAttribute("data-inscribir"));
        return;
      }
      var reservar = evento.target.closest("[data-reservar]");
      if (reservar) {
        agregar(reservar.getAttribute("data-reservar"));
        return;
      }
      var detalle = evento.target.closest("[data-detalle]");
      if (detalle) {
        abrirDetalle(detalle.getAttribute("data-detalle"));
        return;
      }
      var panel = evento.target.closest("[data-panel]");
      if (panel) {
        var tipo = panel.getAttribute("data-panel");
        if (tipo === "carrito") abrirCarrito();
        if (tipo === "login") abrirLogin();
        if (tipo === "asesor") abrirAsesor();
        return;
      }
      var legal = evento.target.closest("[data-legal]");
      if (legal) {
        abrirLegal(legal.getAttribute("data-legal"));
        return;
      }
      var quitarBtn = evento.target.closest("[data-quitar]");
      if (quitarBtn) {
        quitar(quitarBtn.getAttribute("data-quitar"));
        return;
      }
      if (evento.target.closest("[data-accion='catalogo']")) descargarCatalogo();
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key !== "Escape") return;
      cerrarMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 800) cerrarMenu();
      carruseles.forEach(function (carrusel) { carrusel.actualizar(); });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
