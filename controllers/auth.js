const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async ( req, res = express.response ) => {

    const { email, password } = req.body;
    try {

        let usuario = await Usuario.findOne({ email });

        console.log(usuario);
        if( usuario ){
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario existe con ese correo'
            });
        }

        usuario = new Usuario( req.body );

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id,usuario.name);

        res.status(201).json({
            ok:true,
            msg:'register',
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        });
    }

/* 
    if ( name.length < 5) {
        return res.status(400).json({
            ok:false,
            msg: 'El nombre debe ser de 5 letras'
        })
    } */
    

    
}

const loginUsuario = async (req, res = express.response) => {

    const { email, password } = req.body;
    
    try {


        const usuario = await Usuario.findOne({ email });

        console.log(usuario);
        
        // Confirmar Usuario

        if( !usuario ){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario o contraseña no es correcta'
            });
        }

        //Confirmar los passwords

        const validPassword = bcrypt.compareSync(password,usuario.password);

        if (!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'El usuario o contraseña no es correcta'
            })
        }
        //Generar JWT
        const token = await generarJWT(usuario.id,usuario.name);

        res.json({
            ok:true,
            msg:'login',
            uid: usuario.id,
            name: usuario.name,
            token
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        }); 

    }

    
}

const revalidarToken = async (req, res = express.response ) => {

    const uid = req.uid;
    const name = req.name;
    
    const token = await generarJWT(uid,name);

    res.json({
        ok:true,
        msg:'renew',
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}