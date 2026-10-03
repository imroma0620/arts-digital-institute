window.ARTS = {
  cursos: {
    "revit-architecture": {
      id: "revit-architecture",
      nombre: "Revit Architecture Professional — Modelado de Información para Construcción",
      nombreCorto: "Revit Architecture",
      categoria: "Arquitectura & BIM",
      acento: "bim",
      inicioCorto: "15 Enero",
      inicio: "Lunes 15 de Enero",
      horario: "19:00 - 22:00",
      inversion: 290,
      inversionTexto: "$290.00 USD"
    },
    "revit-structure": {
      id: "revit-structure",
      nombre: "Revit Structure Professional — Modelado y Análisis Estructural",
      nombreCorto: "Revit Structure",
      categoria: "Revit & BIM",
      acento: "bim",
      inicio: "Martes 16 de Enero",
      horario: "18:30 - 21:30",
      inversion: 290,
      inversionTexto: "$290.00 USD"
    },
    autocad: {
      id: "autocad",
      nombre: "AutoCAD 2D/3D Completo — Desde cero a nivel experto",
      nombreCorto: "AutoCAD 2D/3D",
      categoria: "Ingeniería & Diseño",
      acento: "ingenieria",
      inicioCorto: "22 Enero",
      inicio: "Lunes 22 de Enero",
      horario: "18:00 - 21:00",
      inversion: 290,
      inversionTexto: "$290.00 USD"
    },
    navisworks: {
      id: "navisworks",
      nombre: "Navisworks Manage Professional — Coordinación y Revisión de Proyectos BIM",
      nombreCorto: "Navisworks Manage",
      categoria: "Construcción & Coordinación",
      acento: "ingenieria",
      inicioCorto: "05 Febrero",
      inicio: "Lunes 05 de Febrero",
      horario: "19:00 - 22:00",
      inversion: 290,
      inversionTexto: "$290.00 USD"
    },
    sketchup: {
      id: "sketchup",
      nombre: "SketchUp Pro",
      categoria: "Visualización 3D",
      acento: "bim",
      inicioCorto: "12 Febrero",
      inversion: 350,
      inversionTexto: "$350.00 USD",
      sigla: "Sk",
      texto: "Modelado 3D intuitivo y rápido para la fase conceptual de tus proyectos arquitectónicos.",
      imagen: "img/formacion/sketchup-render.jpg"
    },
    bluebeam: {
      id: "bluebeam",
      nombre: "Bluebeam Revu",
      categoria: "Gestión Documental",
      acento: "ingenieria",
      inicioCorto: "20 Febrero",
      inversion: 420,
      inversionTexto: "$420.00 USD"
    },
    "render-ai": {
      id: "render-ai",
      nombre: "Render AI",
      categoria: "Innovación Digital",
      acento: "manufactura",
      inicioCorto: "01 Marzo",
      inversion: 499,
      inversionTexto: "$499.00 USD"
    },
    lumion: {
      id: "lumion",
      nombre: "Lumion",
      acento: "ingenieria",
      sigla: "Lu",
      texto: "Renderizado arquitectónico en tiempo real para dar vida y atmósfera a tus diseños.",
      imagen: "img/formacion/lumion-render.jpg"
    },
    vray: {
      id: "vray",
      nombre: "V-Ray",
      acento: "manufactura",
      sigla: "Vr",
      texto: "El estándar de la industria para renderizado fotorealista y visualización de alta gama.",
      imagen: "img/formacion/vray-render.jpg"
    }
  },
  areas: [
    { nombre: "Arquitectura", acento: "bim", imagen: "img/areas/arquitectura.png" },
    { nombre: "Ingeniería y Construcción", acento: "ingenieria", imagen: "img/areas/ingenieria.png" },
    { nombre: "Manufactura", acento: "manufactura", imagen: "img/areas/manufactura.png" },
    { nombre: "Visualización", acento: "sketchup", imagen: "img/areas/visualizacion.png" },
    { nombre: "Diseño Interior", acento: "ingenieria", imagen: "img/areas/interior.png" },
    { nombre: "Infraestructura", acento: "bim", imagen: "img/areas/infraestructura.png" },
    { nombre: "Plantas Industriales", acento: "manufactura", imagen: "img/areas/plantas.png" }
  ],
  lanzamientos: [
    "revit-architecture",
    "autocad",
    "navisworks",
    "sketchup",
    "bluebeam",
    "render-ai"
  ],
  calendario: [
    {
      id: "revit-bim",
      nombre: "REVIT & BIM",
      acento: "bim",
      abierto: true,
      cursos: ["revit-architecture", "revit-structure"]
    },
    {
      id: "ingenieria",
      nombre: "INGENIERÍA & DISEÑO",
      acento: "ingenieria",
      abierto: false,
      cursos: ["autocad"]
    },
    {
      id: "gestion",
      nombre: "GESTIÓN & COORDINACIÓN",
      acento: "manufactura",
      abierto: false,
      cursos: ["navisworks"]
    }
  ],
  formacion: ["sketchup", "lumion", "vray"],
  bim: {
    etiqueta: "Metodología AEC",
    titulo: "CONSTRUYE EL FUTURO CON BIM",
    texto: "Conecta diseño, información y coordinación en un flujo de trabajo integrado.",
    puntos: [
      {
        titulo: "Gestión Eficiente",
        texto: "Control total del ciclo de vida del proyecto, desde el concepto hasta la construcción, optimizando recursos y tiempos.",
        icono: ["M4 4h16v16H4z", "M4 9h16", "M9 9v11"]
      },
      {
        titulo: "Colaboración en Tiempo Real",
        texto: "Coordina equipos multidisciplinarios en la nube con Autodesk Construction Cloud y evita conflictos en obra.",
        icono: ["M4 12h16", "M8 8l-4 4 4 4", "M16 8l4 4-4 4"]
      },
      {
        titulo: "Estándares Internacionales",
        texto: "Fórmate bajo normativas globales ISO 19650 y accede a oportunidades laborales en cualquier parte del mundo.",
        icono: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M3 12h18", "M12 3c2.4 2.8 2.4 15.2 0 18", "M12 3c-2.4 2.8-2.4 15.2 0 18"]
      }
    ],
    cta: "Impulsa tu carrera hoy"
  },
  catalogo: [
    "revit-architecture",
    "revit-structure",
    "autocad",
    "navisworks",
    "sketchup",
    "bluebeam",
    "render-ai",
    "lumion",
    "vray"
  ]
};
