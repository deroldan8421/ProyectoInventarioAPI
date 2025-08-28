const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/authValidator');

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA REGISTRAR UN NUEVO USUARIO
//----------------------------------------------------------------------------------------------------
/**
 * @api {post} /api/auth/register Registrar un nuevo usuario
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiBody {String} username Nombre de usuario.
 * @apiBody {String} password Contraseña del usuario.
 * @apiBody {String} [role=client] Rol del usuario ('admin' o 'client').
 *
 * @apiSuccess {String} message Mensaje de éxito.
 * @apiSuccess {Object} user Datos del usuario registrado.
 * @apiSuccessExample {json} Respuesta exitosa:
 * HTTP/1.1 201 Created
 * {
 * "message": "Usuario registrado exitosamente",
 * "user": {
 * "id": 1,
 * "username": "testuser",
 * "role": "client"
 * }
 * }
 *
 * @apiError (400 Bad Request) ValidationError Datos de entrada inválidos.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al registrar el usuario.
 */
router.post('/register', validateRegister, authController.register);

//----------------------------------------------------------------------------------------------------
// DOCUMENTACIÓN Y RUTA PARA INICIAR SESIÓN
//----------------------------------------------------------------------------------------------------
/**
 * @api {post} /api/auth/login Iniciar sesión
 * @apiName LoginUser
 * @apiGroup Auth
 *
 * @apiBody {String} username Nombre de usuario.
 * @apiBody {String} password Contraseña del usuario.
 *
 * @apiSuccess {String} token Token de autenticación JWT.
 * @apiSuccessExample {json} Respuesta exitosa:
 * HTTP/1.1 200 OK
 * {
 * "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 * }
 *
 * @apiError (401 Unauthorized) AuthError Usuario no encontrado o contraseña incorrecta.
 * @apiError (500 Internal Server Error) ServerError Error del servidor al autenticar.
 */
router.post('/login', validateLogin, authController.login);

module.exports = router;