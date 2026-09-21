# Legionarios — Lista de Asistencia (offline + sincronización en la nube)

App web simple para tomar asistencia de los internos que juegan al rugby los miércoles y
jueves, pensada para funcionar **sin conexión dentro del penal** y sincronizarse sola,
sin que ningún voluntario tenga que exportar ni importar nada, apenas alguien recupera
señal afuera.

## Qué resuelve

- Padrón de internos: nombre, apellido, pabellón, foto, fecha de ingreso al programa.
- Pabellones con su referente y contacto.
- Toma de asistencia por fecha, agrupada por pabellón.
- Reportes de % de presentismo por rango de fechas, incluido un ranking por pabellón para
  premiar al más cumplidor.
- Todo funciona 100% offline una vez cargada la app: no depende de wifi ni datos dentro
  del penal.
- Los voluntarios cargan cada uno en su propio celular y todo se sincroniza solo con el
  resto del equipo apenas hay señal — no hace falta fusionar archivos a mano.
- Importa directo planillas Excel (.xlsx) con columnas de apellido/nombre, pabellón, DNI
  y fechas de asistencia, para cargar o actualizar el padrón sin tipear nada a mano.

## Cómo instalarla (una sola vez, con conexión)

La forma más práctica es subir esta carpeta a un hosting gratuito para que cada
voluntario la abra desde su celular y la instale como si fuera una app (ícono en la
pantalla de inicio). Una vez instalada, no necesita internet nunca más para usarse (salvo
para que la sincronización con la nube mande/reciba cambios, que pasa sola en segundo
plano apenas hay señal).

**Opción recomendada: GitHub Pages (gratis)**

1. Crear un repositorio (tiene que ser público para usar GitHub Pages gratis — no expone
   datos de internos, solo el código de la app) y subir estos 7 archivos: `index.html`,
   `manifest.json`, `sw.js`, `icon-192.png`, `icon-512.png`, `xlsx.full.min.js`,
   `firebase-compat-bundle.js`.
2. Activar GitHub Pages para ese repositorio (Settings → Pages → Deploy from branch).
3. Se genera una URL tipo `https://tuusuario.github.io/legionarios/`.
4. Cada voluntario abre esa URL una vez desde el celular (con wifi o datos) y usa
   "Agregar a pantalla de inicio" (Chrome/Safari). Desde ahí queda instalada, funciona sin
   conexión, y apenas tuvo esa primera conexión ya queda sincronizada con el resto del
   equipo.

Si prefieren no usar GitHub, cualquier hosting estático gratuito sirve igual (Netlify,
Vercel, Cloudflare Pages).

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
   asistencias históricas se agregaron) para que puedas revisarlo en el Padrón. Todo lo
   que se crea o actualiza acá se sincroniza a la nube igual que una carga manual.

Un comentario como "Libertad" o "a UP 46" en la columna Comentario da de baja
automáticamente al interno (lo marca inactivo) y deja la razón anotada — igual queda
todo su historial de asistencia, por si necesitás consultarlo después.

Esto reemplaza tener que pedirme que te convierta la planilla a mano cada vez: cualquier
Excel con esa forma general (aunque no tenga exactamente las mismas columnas) se puede
importar así.

## Cómo se sincroniza el equipo (automático, en la nube)

Cada vez que cargás, editás o eliminás algo (un interno, un pabellón, una asistencia),
la app lo guarda en el celular como siempre **y además** lo manda a una base compartida
en la nube (Firestore, de Google/Firebase). Al mismo tiempo, la app está escuchando esa
base compartida: apenas otro voluntario carga algo, aparece solo en tu celular la próxima
vez que tengas señal — no hay que exportar ni importar archivos.

Arriba de todo, al lado del nombre de la app, hay un indicador de estado:

- **☁️ Sincronizado** — hay señal y todo lo cargado ya viajó (o está viajando) a la nube.
- **📴 Sin señal — se guarda local** — no hay conexión ahora mismo. No pasa nada: todo se
  sigue guardando en el celular y se sube solo apenas vuelva la señal, aunque hayan pasado
  varias prácticas de por medio.

Los borrados también se sincronizan: cuando eliminás un interno o un pabellón, queda
marcado como eliminado con fecha y hora, y esa marca viaja igual que cualquier otro
cambio — así desaparece en todos los celulares del equipo, sin tener que vaciar ninguna
base a mano.

**Requisito:** todos los voluntarios tienen que tener instalada esta versión de la app
(o una posterior) para que la sincronización funcione — fijate el numerito de versión
junto al nombre de la app arriba de todo.

**Respaldo manual (ya no es necesario para el día a día, pero queda como red de
seguridad):** en la pestaña Backup seguís teniendo "Exportar todo (.json)" e
"Importar / fusionar", por si alguna vez hace falta migrar un celular a mano o restaurar
algo sin depender de la nube.

**Sobre "Zona de peligro":** ese botón ahora solo vacía la copia local de ESE celular. Si
el celular tiene señal y está sincronizado, lo que borrés ahí va a volver a bajar solo de
la nube en segundos — ya no sirve como método para "limpiar la base compartida". Para
borrar a alguien de verdad (en todos lados) usá el botón "Eliminar" de cada interno en el
Padrón.

## Reportes y premios

En la pestaña **Reportes**, eligiendo un rango de fechas (por ejemplo, el último mes),
la app calcula el % de asistencia de cada interno sobre las sesiones registradas desde
su fecha de ingreso al programa — así un ingresante reciente no queda perjudicado por
sesiones anteriores a que existiera en el padrón. También arma un ranking de presentismo
por pabellón, para elegir al más cumplidor. Se puede exportar la tabla a CSV.

## Sobre la privacidad de los datos

Estás guardando nombres, fotos y ubicación (pabellón) de personas privadas de su
libertad — es información sensible y vale la pena tratarla con cuidado:

- Los datos ahora viven también en una base en la nube (Firestore, de Google/Firebase),
  además del celular de cada voluntario. El acceso a esa base está restringido: solo la
  app del equipo puede leer o escribir ahí (no es una base pública ni indexable por
  buscadores), pero no es un cifrado de grado bancario — es una protección equivalente a
  la del PIN de la app.
- La app ofrece un PIN de acceso simple al abrirla (no es un cifrado real, es solo una
  traba para que alguien no pueda mirar la app si toma el celular prestado). La
  protección real es la del celular: conviene que todos los dispositivos usados tengan
  bloqueo de pantalla y cifrado del almacenamiento (viene activado por defecto en la
  mayoría de los celulares modernos).
- Evitar subir los archivos de backup manual a servicios públicos o grupos abiertos; usar
  canales privados (mail directo, Drive con acceso restringido) entre los voluntarios.
- Vale la pena confirmar con el Servicio Penitenciario si tienen algún requisito o
  protocolo formal sobre el registro de fotos y datos de los internos, para que el
  sistema esté alineado con eso desde el vamos.
- La Ley 25.326 de Protección de Datos Personales aplica a este tipo de registros;
  no hace falta nada complejo, pero conviene tener claro quién tiene acceso a la base y
  los backups, y para qué se usan los datos (en este caso, solo para gestionar la
  participación en el programa y decidir premios).
