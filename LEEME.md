# mozé · centro de eventos

Sitio en HTML, CSS y JavaScript puro. No requiere Node, npm ni compilación.

## Estructura

```
index.html    Estructura
styles.css    Diseño
content.js    ← teléfono, fotos y enlaces
main.js       Animaciones y lógica
FOTOS/        22 fotos ya optimizadas
```

**Los cinco elementos van en la misma carpeta.** `FOTOS/` al lado de `index.html`.

## Para verlo

Doble clic en `index.html`.

> Si algo no carga al abrirlo directo, usa un servidor local:
> VS Code → extensión **Live Server** → clic derecho → *Open with Live Server*.

## Para publicarlo

Arrastra la carpeta completa a [netlify.com/drop](https://app.netlify.com/drop).
Queda en línea en menos de un minuto, gratis.

---

## Sobre las fotos

Las 22 del sitio salieron de tu carpeta original. Las redimensioné y
comprimí: **más de 150 MB → 3.7 MB**, sin pérdida visible. Los originales de
25 MB habrían hecho que el sitio tardara minutos en abrir desde un celular.

Quedaron con nombres descriptivos:

| Archivo | Dónde aparece |
|---|---|
| `hero.jpg` | Primera pantalla |
| `jardin-mesa.jpg` | Sección "Dos ambientes" (vertical) |
| `salon-arquitectura.jpg` | Sección "Dos ambientes" (horizontal) |
| `salon-montaje.jpg` | Galería 01 |
| `salon-capacidad.jpg` | Galería 02 |
| `detalle-mesa.jpg` | Galería 03 |
| `mesa-principal.jpg` | Galería 04 |
| `jardin-noche.jpg` | Galería 05 |
| `gastronomia.jpg` | Galería 06 |
| `evento-*.jpg` | Fondo de cada banda en Eventos |
| `servicio-*.jpg` | Panel correspondiente en Servicios |
| `ubicacion.jpg` | Sección Ubicación |

**Para cambiar una foto:** sustituye el archivo conservando el mismo
nombre. No necesitas tocar código.

**Para usar otra de tu carpeta original:** compárala primero en
[squoosh.app](https://squoosh.app) — máximo 1600 px de ancho y 400 KB.

---

## Cómo cambiar lo demás

### Contacto — en `content.js`

```js
telefono:  '+529611465809',
whatsapp:  '529611465809',
instagram: 'mozecentrodeeventos',
mapsQuery: 'mozé centro de eventos, Tuxtla Gutiérrez, Chiapas',
```

`mapsQuery` es lo que se abre al pulsar "Abrir en Google Maps".
Ponle la dirección exacta.

### Textos — en `index.html`

Búscalos y reemplázalos directamente.

### Colores — en `styles.css`

```css
--bone:   #F2EEE7;   /* fondo claro */
--ink:    #17150F;   /* fondo oscuro y texto */
--accent: #A8542B;   /* terracota */
```

---

## El formulario

Arma un mensaje con los datos y abre WhatsApp. Funciona sin servidor
y es lo que mejor convierte en México.

**Si prefieres recibirlo por correo:**
1. Crea un formulario gratis en [formspree.io](https://formspree.io).
2. En `main.js`, busca `CONECTA AQUÍ TU BACKEND`.
3. Descomenta el bloque `fetch` y pega tu ID.

---

## Variantes de sección

Cinco secciones tienen dos versiones. Cambia la letra en `content.js`
y recarga:

```js
variantes: {
  hero:      'a',   // 'a' full-bleed  ·  'b' partido, tipografía + foto
  sobre:     'a',   // 'a' asimétrico  ·  'b' centrado con cifras grandes
  galeria:   'a',   // 'a' horizontal  ·  'b' tres columnas a distinta velocidad
  eventos:   'a',   // 'a' marquesina  ·  'b' nombre centrado, quieto
  servicios: 'a'    // 'a' apilable    ·  'b' índice tipográfico sin fotos
},
```

Se combinan libremente: puedes tener hero `b`, galería `b` y el resto `a`.

**La versión que no eliges no pesa nada.** Vive dentro de un `<template>`,
y el navegador no descarga las imágenes que hay ahí dentro. Elegir `a` o
`b` no cambia lo que tarda el sitio en abrir.

### Cuál conviene a cada caso

**Galería `b`** es la que más se acerca a lo que pediste: nueve fotos en
tres columnas que se desplazan a distinta velocidad. Muestra el triple de
imágenes que la horizontal y no secuestra el scroll. Si tienes buena
fotografía —y la tienes—, ésta la luce mejor.

**Eventos `b`** es la que pediste explícitamente: el nombre centrado y
quieto, sin texto corriendo. Menos ruido, y quita seis marquesinas de
trabajo por fotograma. La banda sigue expandiéndose y revelando la foto.

**Servicios `b`** no lleva fotos. Es un índice tipográfico. Si sientes que
la página ya tiene demasiada imagen para cuando llegas ahí, ésta descansa
la vista antes del cierre.

**Hero `b`** parte la pantalla: tipografía sobre fondo claro a la
izquierda, foto a la derecha. Se lee más como estudio de arquitectura y
menos como cine. Menos impacto inmediato, más sofisticación.

---

## Cómo funcionan las dos secciones nuevas

**Eventos — bandas cinéticas.** Seis franjas con el nombre repitiéndose en
movimiento. Al pasar el cursor, la banda se expande y las otras ceden
espacio: la altura total nunca cambia, así que la página no salta.
En celular la banda activa se elige sola según lo que esté centrado.

Para cambiar el orden o los textos, edita los bloques `<a class="band">`
en `index.html`. El atributo `data-speed` controla qué tan rápido corre
el texto de esa banda; `data-dir` con `1` o `-1` invierte el sentido.

**Servicios — paneles apilables.** Cada panel se queda pegado arriba y el
siguiente se le encima, mientras el anterior se encoge y se oscurece.
Para agregar o quitar uno, copia un bloque `<article class="pile__item">`
y corrige el `--i` (0, 1, 2…) que define su escalón.

La velocidad del scroll acelera todas las marquesinas y hasta invierte su
sentido si scrolleas hacia arriba. Ese detalle es el que da la sensación
de que la página responde a ti.

---

## Si vas a tocar el CSS, lee esto

Cuatro cosas hunden el rendimiento de un sitio como éste. Las quité; no
las regreses sin medir antes:

**`mix-blend-mode` a pantalla completa.** Obliga al navegador a recomponer
todo el viewport en cada fotograma. El grano quedó estático y sin blend:
se ve igual y cuesta casi nada. La única excepción es el cursor, que mide
38 px.

**`backdrop-filter`.** El desenfoque de la barra de navegación era de lo
más caro que puede pedirse. Ahora es un fondo sólido al 94%.

**`will-change` permanente.** Cada declaración pide una capa de GPU propia.
Con doce imágenes grandes se agota la memoria gráfica de un teléfono de
gama media y todo se atasca. Sólo queda en las cuatro pistas de texto que
efectivamente se mueven sin parar.

**Animar `filter`, `clip-path` o `skew` durante el scroll.** Repintan en
cada fotograma. `transform` y `opacity` los resuelve el compositor sin
tocar la CPU. Los reveals sí usan `clip-path`, pero corren una sola vez al
entrar, no atados al scroll.

Las fotos también están cortadas a la medida real en que se muestran. Si
subes una foto de banda, que sea panorámica (1400×620); si subes una de
panel de servicio, cuadrada (800×800). Una foto de 4000 px mostrada en un
recuadro de 450 px se decodifica completa igual, y eso se siente.

---

## Pendientes antes de publicar

- [ ] **Dirección exacta** en `mapsQuery` y en el bloque `<address>` del HTML
- [ ] **Verificar los números.** Puse capacidad 500, superficie 1200 m²,
      120 cajones y 12 años de operación como estimados para que el sitio
      estuviera completo. Están en `index.html` marcados como `data-count`.
      Cámbialos por los reales.
- [ ] Confirmar que el jardín y el salón se rentan juntos o por separado
      (el copy actual asume que están en el mismo predio)
- [ ] Probar en un celular real, no solo en el simulador del navegador
- [ ] Revisar que ninguna foto de servicio contradiga lo que ofreces
      (`servicio-salon.jpg` muestra el salón en montaje formal de auditorio)
