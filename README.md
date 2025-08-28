API de Inventario
Esta es una API RESTful para la gestión de un sistema de inventario de productos. Permite a los usuarios y administradores autenticarse, gestionar productos y llevar un registro de las compras. La API está diseñada siguiendo principios de modularidad y utiliza un ORM (Sequelize) para interactuar con la base de datos.

Estructura del Proyecto
El proyecto está organizado en las siguientes carpetas para una clara separación de responsabilidades:

config/: Archivos de configuración, incluyendo el logger y la conexión a la base de datos.

controllers/: Contiene la lógica de negocio para cada ruta de la API.

middleware/: Funciones de middleware para la autenticación y validación.

models/: Define los modelos de la base de datos (tablas).

routes/: Define todas las rutas de la API.

validators/: Contiene la lógica de validación de los datos de entrada.

apidoc/: Documentación de la API generada automáticamente.

Requisitos
Node.js (versión 14 o superior)

npm (gestor de paquetes de Node.js)

PostgreSQL (o cualquier otra base de datos compatible con Sequelize)

Instalación
Clonar el repositorio:

Bash

git clone https://github.com/deroldan8421/ProyectoInventarioAPI.git
Navegar al directorio del proyecto:

Bash

cd ProyectoInventarioAPI
Instalar las dependencias del proyecto:

Bash

npm install
Configuración del Entorno
Crea un archivo llamado .env en la raíz del proyecto.

Agrega las siguientes variables para configurar la conexión a la base de datos y la clave de autenticación.

Fragmento de código

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=inventario_db
SECRET_KEY=tu_clave_secreta_jwt
Ejecución del Software
Sincronizar la base de datos e iniciar el servidor:

Bash

node app.js
Si tienes instalado nodemon para desarrollo, puedes usar:

Bash

nodemon app.js
Verás un mensaje en la terminal que indica que el servidor se ha iniciado correctamente y que la base de datos está sincronizada.

Documentación de la API
La API cuenta con documentación generada automáticamente con apidoc. Para ver todos los endpoints disponibles, los parámetros, los cuerpos de las solicitudes y las respuestas, sigue estos pasos:

Generar la documentación:

Bash

apidoc -i . -o apidoc/
Visualizar la documentación:

Abre el archivo apidoc/index.html en tu navegador web.