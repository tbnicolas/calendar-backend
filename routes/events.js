
const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campo');
const { isDate } = require('../helpers/isDate');
const { 
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento 
} = require('../controllers/event');

const router = new Router();

router.use( validarJWT );

/* // Todas tienen que pasar por la validacion del JWT

//Obtener evento
router.get('/', validarJWT, getEventos);

//Crear un nuevo evento
router.post('/', validarJWT, crearEvento);

//Actualizar evento
router.put('/:id', validarJWT, actualizarEvento);

//Borrar evento
router.delete('/:id', validarJWT, eliminarEvento); */



// Todas tienen que pasar por la validacion del JWT

//Obtener evento
router.get('/', getEventos);

//Crear un nuevo evento
router.post('/',[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Fecha de inicio es obligatoria').custom( isDate ),
    check('end','Fecha de finalizacion es obligatoria').custom( isDate ),
    validarCampos
], crearEvento);

//Actualizar evento
router.put('/:id', actualizarEvento);

//Borrar evento
router.delete('/:id', eliminarEvento);

module.exports = router;