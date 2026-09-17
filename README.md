# Legionarios — Lista de Asistencia (offline)

App web simple para tomar asistencia de los internos que juegan al rugby los miércoles y
jueves, pensada para funcionar **sin conexión dentro del penal** y sincronizarse recién
cuando cada voluntario recupera señal afuera.

## Qué resuelve

- Padrón de internos: nombre, apellido, pabellón, foto, fecha de ingreso al programa.
- Pabellones con su referente y contacto.
- Toma de asistencia por fecha, agrupada por pabellón.
- Reportes de % de presentismo por rango de fechas, para armar la lista de premiados.
- Todo funciona 100% offline una vez cargada la app: no depende de wifi ni datos dentro
  del penal.
- Varios voluntarios pueden cargar en sus propios celulares y después **fusionar** los
  datos en un solo archivo, sin pisarse ni duplicar registros.
- Importa directo planillas Excel (.xlsx) con columnas de apellido/nombre, pabellón, DNI
  y fechas de asistencia, para cargar o actualizar el padrón sin tipear nada a mano.

## Cómo instalarla (una sola vez, con conexión)

La forma más práctica es subir esta carpeta a un hosting gratuito para que cada
voluntario la abra desde su celular y la instale como si fuera una app (ícono en la
pantalla de inicio). Una vez instalada, no necesita internet nunca más para usarse.

**Opción recomendada: GitHub Pages (gratis)**

1. Crear un repositorio (puede ser privado) y subir estos 6 archivos: `index.html`,
   `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `xlsx.full.min.js`.
2. Activar GitHub Pages para ese repositorio (Settings → Pages → Deploy from branch).
3. Se genera una URL tipo `https://tuusuario.github.io/legionarios/`.
4. Cada voluntario abre esa URL una vez desde el celular (con wifi o datos) y usa
   "Agregar a pantalla de inicio" (Chrome/Safari). Desde ahí queda instalada y
   funciona sin conexión.

Si prefieren no usar GitHub, cualquier hosting estático gratuito sirve igual (Netlify,
Vercel, Cloudflare Pages). Si más adelante quieren, puedo ayudarles a dejarlo publicado.

**Alternativa sin hosting:** abrir directamente `index.html` en el navegador del
celular (por ejemplo enviándolo por WhatsApp/mail y abriéndolo desde el archivo). Funciona
igual para cargar datos offline, pero no se puede "instalar" como ícono ni se
garantiza el cacheo automático del service worker en todos los navegadores — como
respaldo funciona bien, pero la vía de GitHub Pages es más robusta para el uso de todos
los días.

## Cómo se usa un día de práctica

1. Cada voluntario abre la app en su celular (sin necesidad de señal).
2. Escribe su nombre en el campo "voluntario" (queda guardado para la próxima vez).
3. Va a la pestaña **Padrón** si hay algún interno nuevo (ingresante) para cargar:
   nombre, apellido, pabellón, foto (con la cámara del celular) y fecha de ingreso.
4. Va a la pestaña **Asistencia**, revisa que la fecha sea la de hoy, y marca presente
   a cada interno agrupado por pabellón.
5. Toca "Guardar asistencia de hoy". Con eso ya quedó todo guardado en el celular, sin
   necesitar internet en ningún momento.

## Cómo importar una planilla Excel (padrón, pabellón, DNI, asistencia histórica)

En la pestaña **Backup**, sección "Importar planilla Excel (.xlsx)":

1. Elegí el archivo .xlsx (por ejemplo tu planilla de asistencias con la hoja "Base").
2. La app te deja elegir qué hoja del archivo importar (un Excel puede tener varias
   hojas) y en qué año caen las columnas de fecha (si la planilla las tiene como
   "4/6", "11/6", etc., sin año).
3. Tocás "Importar esta hoja". La app busca sola la fila de encabezados y reconoce
   columnas por su nombre: "Apellido y Nombre" (o "Apellido"/"Nombre" separados),
   "pab" o "Pabellón", "DNI", "Comentario"/"Notas", "Apodo", y cualquier columna con
   forma de fecha (día/mes) como asistencia histórica.
4. Para cada fila: si el nombre ya existe en el padrón (lo compara sin importar
   mayúsculas/acentos ni orden de palabras) le actualiza el pabellón y le agrega a
   "Notas" el DNI o comentario si falta, sin tocar la foto ni el apodo que ya le
   hayas cargado a mano. Si el interno todavía no existe, lo crea. Las asistencias de
   fechas que ya tenías cargadas a mano nunca se pisan, solo se completan las que
   faltan.
5. Al terminar te muestra un resumen (cuántos nuevos, cuántos actualizados, cuántas
   asistencias históricas se agregaron) para que puedas revisarlo en el Padrón.

Un comentario como "Libertad" o "a UP 46" en la columna Comentario da de baja
automáticamente al interno (lo marca inactivo) y deja la razón anotada — igual queda
todo su historial de asistencia, por si necesitás consultarlo después.

Esto reemplaza tener que pedirme que te convierta la planilla a mano cada vez: cualquier
Excel con esa forma general (aunque no tenga exactamente las mismas columnas) se puede
importar así.

## Cómo se fusionan los datos entre voluntarios (después, con señal)

Como no hay forma de sincronizar en tiempo real sin conexión, el mecanismo es un
intercambio de archivos apenas alguien tiene señal (generalmente el mismo día, al salir
del penal):

1. En la pestaña **Backup**, cada voluntario toca "Exportar todo (.json)". Se descarga
   un archivo con todo lo que cargó ese celular (incluidas las fotos).
2. Ese archivo se comparte por WhatsApp, mail o Drive con el resto del equipo (o con la
   persona que mantiene la copia "maestra", por ejemplo vos).
3. Cada voluntario (o la persona a cargo de la copia maestra) importa los archivos de
   los demás desde la misma pestaña Backup, botón "Importar / fusionar".
4. La fusión es automática y segura: cada registro tiene un identificador único y una
   marca de tiempo de última edición, así que nunca se duplica un interno ni una
   asistencia — si dos personas editaron lo mismo, gana la edición más reciente.
5. Conviene que, después de fusionar, la persona con la copia más completa vuelva a
   exportar y distribuya ese archivo a los demás, para que todos arranquen la próxima
   práctica con el padrón actualizado (por ejemplo, los pabellones y los nuevos
   ingresantes que cargó otro voluntario).

**Los borrados también se fusionan.** Cuando eliminás un interno del padrón, la app no lo
borra "en silencio": lo marca como eliminado con fecha y hora. Esa marca es un cambio más,
así que cuando fusiones ese archivo en otro celular o compu, el interno se va a eliminar
ahí también (deja de aparecer en Padrón, Asistencia y Reportes), sin necesidad de vaciar la
base antes de importar. Eso sí: para que esto funcione todos los dispositivos tienen que
tener actualizada la app a esta versión o una posterior (fijate el numerito de versión que
aparece arriba de todo, junto al nombre de la app).

Este ida y vuelta de archivos reemplaza a una base de datos central: no requiere
servidor, no requiere que la cárcel tenga wifi, y funciona con lo que ya tienen (los
celulares del equipo).

## Reportes y premios

En la pestaña **Reportes**, eligiendo un rango de fechas (por ejemplo, el último mes),
la app calcula el % de asistencia de cada interno sobre las sesiones registradas desde
su fecha de ingreso al programa — así un ingresante reciente no queda perjudicado por
sesiones anteriores a que existiera en el padrón. Se puede exportar esa tabla a CSV para
armar la lista de premiados.

## Sobre la privacidad de los datos

Estás guardando nombres, fotos y ubicación (pabellón) de personas privadas de su
libertad — es información sensible y vale la pena tratarla con cuidado:

- La app ofrece un PIN de acceso simple al abrirla (no es un cifrado real, es solo una
  traba para que alguien no pueda mirar la app si toma el celular prestado). La
  protección real es la del celular: conviene que todos los dispositivos usados tengan
  bloqueo de pantalla y cifrado del almacenamiento (viene activado por defecto en la
  mayoría de los celulares modernos).
- Evitar subir los archivos de backup a servicios públicos o grupos abiertos; usar
  canales privados (mail directo, Drive con acceso restringido) entre los voluntarios.
- Vale la pena confirmar con el Servicio Penitenciario si tienen algún requisito o
  protocolo formal sobre el registro de fotos y datos de los internos, para que el
  sistema esté alineado con eso desde el vamos.
- La Ley 25.326 de Protección de Datos Personales aplica a este tipo de registros;
  no hace falta nada complejo, pero conviene tener claro quién tiene acceso a los
  backups y para qué se usan los datos (en este caso, solo para gestionar la
  participación en el programa y decidir premios).

## Si el grupo crece bastante (60+, varios pabellones)

El diseño actual (archivos que se fusionan) funciona bien para un equipo chico de
voluntarios y un padrón de hasta un centenar de personas. Si en el futuro quieren
sincronización automática en tiempo real (por ejemplo, un servidor compartido en la nube
al que cada celular se conecta apenas tiene señal, sin tener que exportar/importar
archivos a mano), se puede migrar este mismo diseño a un backend simple (Firebase o
Supabase) sin tener que rehacer la app — son dos pasos naturales, no hace falta saltar
directo al más complejo si por ahora no lo necesitan.
