ARTS DIGITAL INSTITUTE
Cómo está armada la página y dónde se cambia cada cosa
Sitio publicado: https://arts-digital-institute.vercel.app


1. ORDEN DE LA PÁGINA, DE ARRIBA A ABAJO

La página es un solo archivo, index.html. Los bloques van en este orden y no se deben mezclar:

  1. Cabecera fija
     Logo, menú (Cursos y Contacto) e icono del carrito.
  2. Banners de inicio (#inicio)
     Tres imágenes que rotan solas cada 7 segundos.
  3. Franja de atributos (#instituto)
     Fondo negro, texto blanco. Centro autorizado, certificación,
     clases online en vivo y sede en Florida.
  4. Áreas de especialización (#areas)
     Carrusel. En escritorio se ven 4 tarjetas.
  5. Nuevos lanzamientos (#lanzamientos)
     Carrusel. En escritorio se ven 3 tarjetas.
  6. Calendario de cursos (#calendario)
     Acordeón con las fechas. Los cuatro cursos de esta lista cuestan 290 USD.
  7. Formación avanzada (#formacion)
     SketchUp, Lumion y V-Ray, con foto y una línea de color debajo.
  8. Metodología BIM (#bim)
     Tres círculos solo con contorno, sin relleno.
  9. Cierre (#cierre)
     Fondo blanco. El título grande es:
     IMPULSA TUS HABILIDADES. AMPLÍA TUS OPORTUNIDADES.
  10. Pie
      Fondo negro, letras blancas. Logo blanco, enlaces legales y la línea
      © 2024 Arts Digital Institute. Autodesk Authorized Training Center. Florida, USA.

El menú solo tiene dos enlaces:
  Cursos   -> #areas
  Contacto -> #cierre


2. DÓNDE VA CADA ARCHIVO

Nada de imágenes sueltas en la raíz del proyecto. La raíz solo lleva
estos archivos de la página:

  index.html     la estructura y el orden de las secciones
  README.txt     este documento
  css/estilos.css    colores, márgenes, tamaños y fondos
  js/contenido.js    textos, precios, cursos e imágenes que se pintan
  js/app.js          carruseles, calendario, carrito, formulario y catálogo

Imágenes, siempre dentro de img/:

  img/logo-esquina.png
      Logo de la esquina superior (cabecera). Fondo transparente.
  img/logo-pie.png
      Logo del pie, en blanco, sobre el fondo negro.

  img/banners/
      banner-1-escritorio.png   banner-1-movil.png
      banner-2-escritorio.png   banner-2-movil.png
      banner-3-escritorio.png   banner-3-movil.png
      Escritorio: proporción 1920 x 600.
      Móvil: proporción 1080 x 1350.
      El banner 2 es el claro; solo las fichas de precio van en blanco.
      Los banners 1 y 3 llevan el texto en blanco sobre la foto.

  img/areas/
      Una imagen por tarjeta, en este orden:
      arquitectura.jpg, ingenieria.jpg, manufactura.jpg,
      visualizacion.jpg, interior.jpg, infraestructura.jpg, plantas.jpg

  img/formacion/
      sketchup-render.jpg
      lumion-render.jpg
      vray-render.jpg
      Esas tres son las que se ven. Si quedan copias viejas
      (sketchup.jpg, lumion.jpg, vray.jpg), la página no las usa.

  Md/
      Notas de contenido y de marca. No se publican en la página.

Las capturas con nombre que empieza por guion bajo (_gris, _bim, etc.)
eran pruebas de pantalla. No forman parte del sitio y no deben volver
a guardarse en la raíz.


3. QUÉ ARCHIVO SE TOCA PARA CAMBIAR ALGO

Textos, precios y listas de cursos
  js/contenido.js
  Ahí están las áreas, los lanzamientos, el calendario, la formación
  y los tres puntos de la metodología BIM.
  Los cursos del calendario y de lanzamientos comparten el mismo id
  para que el carrito no los duplique.

Imágenes de un bloque
  Se reemplaza el archivo dentro de su carpeta, con el mismo nombre,
  o se cambia la ruta en index.html (banners y logo) o en js/contenido.js
  (áreas y formación).

Colores, márgenes y fondos
  css/estilos.css
  Al inicio del archivo están los colores base:
    Texto         #111111
    Rojo botones  #A02444
    Azul BIM      #1858a8
    Azul SketchUp #005F9E
    Violeta       #6B4C9A
    Amarillo      #C8960E
    Borde         #E6E6E9

  Fondos de sección, como están ahora:
    Áreas         #E0E0E0
    Calendario    gris cálido #D7D9D7
    BIM           gris claro #E0E4E8
    Formación y cierre    blanco
    Franja de atributos   negro, letras blancas

  La metodología BIM lleva más aire a los lados que el resto:
  unos 96 px en pantallas de escritorio y tablet, y 24 px en el teléfono.
  Los círculos van sin relleno: solo borde e icono en línea.

Orden de las secciones
  index.html, dentro de <main id="contenido">.
  Se mueve el <section> completo, con su id. Los enlaces del menú
  y de los botones apuntan a esos id (#areas, #calendario, #bim, #cierre).


4. CÓMO SE VE EN EL NAVEGADOR

  Escritorio ancho: 4 áreas por pantalla y 3 lanzamientos.
  Menos de 1040 px: 2 tarjetas.
  Menos de 760 px: 1 tarjeta.
  Menos de 700 px: banners en formato vertical de móvil
  y el menú se abre con el botón de hamburguesa.

La tipografía es Poppins. El rojo solo va en los botones.
El carrito y el formulario del asesor se guardan en la memoria
de esa visita; no hay pago ni correo enviado.
El catálogo se descarga como catalogo-arts.txt.
