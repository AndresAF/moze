/* ============================================================
   MOZÉ · CONTENIDO
   ------------------------------------------------------------
   Este es el ÚNICO archivo que necesitas tocar para cambiar
   datos de contacto, fotos y enlaces.
   ============================================================ */

const SITE = {

  /* ---- Datos del negocio ---------------------------------- */
  nombre:    'mozé',
  telefono:  '+529611465809',          // internacional, sin espacios
  whatsapp:  '529611465809',           // sin el "+"
  waMensaje: 'Hola, me interesa cotizar un evento en mozé.',
  instagram: 'mozecentrodeeventos',
  mapsQuery: 'mozé centro de eventos, Tuxtla Gutiérrez, Chiapas',

  /* ---- VARIANTES DE SECCIÓN --------------------------------
     Cada sección tiene dos versiones. Cambia la letra y recarga.
     La versión que no elijas no descarga ninguna imagen.

       hero      'a' full-bleed cinematográfico
                 'b' partido: tipografía a la izquierda, foto a la derecha
       sobre     'a' editorial asimétrico con dos fotos
                 'b' centrado, cifras grandes y una foto panorámica
       galeria   'a' scroll horizontal con la sección anclada
                 'b' tres columnas a distintas velocidades
       eventos   'a' bandas con texto en marquesina
                 'b' bandas con el nombre centrado y quieto
       servicios 'a' paneles que se apilan
                 'b' índice tipográfico, sin fotos
  ---------------------------------------------------------- */
  variantes: {
    hero:      'a',
    sobre:     'a',
    galeria:   'a',
    eventos:   'a',
    servicios: 'a'
  },

  /* ---- Tratamiento de imágenes ----------------------------
     false = fotografía real, color original.
     true  = aplica duotono (solo para fotos de muestra).
  ---------------------------------------------------------- */
  duotono: false,

  /* ---- Fotografías ----------------------------------------
     Viven en FOTOS/, junto a index.html.
     Para cambiar una: sustituye el archivo conservando el
     mismo nombre, o edita la ruta aquí.
  ---------------------------------------------------------- */
  fotos: {
    hero:   'FOTOS/hero.jpg',                  // salón drapeado, montaje completo

    about1: 'FOTOS/jardin-mesa.jpg',           // jardín, mesa larga bajo los árboles
    about2: 'FOTOS/salon-arquitectura.jpg',    // salón vacío, planta libre

    g1: 'FOTOS/salon-montaje.jpg',             // 01 · Salón principal
    g2: 'FOTOS/salon-capacidad.jpg',           // 02 · Capacidad
    g3: 'FOTOS/detalle-mesa.jpg',              // 03 · Detalle
    g4: 'FOTOS/mesa-principal.jpg',            // 04 · Mesa principal
    g5: 'FOTOS/jardin-noche.jpg',              // 05 · Jardín
    g6: 'FOTOS/gastronomia.jpg',               // 06 · Cocina

    e1: 'FOTOS/evento-bodas.jpg',
    e2: 'FOTOS/evento-xv.jpg',
    e3: 'FOTOS/evento-corporativo.jpg',
    e4: 'FOTOS/evento-cumpleanos.jpg',
    e5: 'FOTOS/evento-graduacion.jpg',
    e6: 'FOTOS/evento-privado.jpg',

    loc: 'FOTOS/ubicacion.jpg',                // jardín al atardecer

    // Sólo se usan en la galería variante 'b'
    c1: 'FOTOS/galeria-techo.jpg',
    c2: 'FOTOS/galeria-salon-rosa.jpg',
    c3: 'FOTOS/galeria-neon.jpg'
  }
};
