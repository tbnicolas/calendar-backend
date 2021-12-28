const jwt = require('jsonwebtoken');

const generarJWT = ( uid, name ) => {

    const promesa = new Promise(( resolve, reject )=>{

        const payload = { uid, name };
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        },( err, token )=>{
            if( err ) {
                console.log(err);
                reject('No se pudo generar el token')
            }
            resolve(token);
        });

    });

    return promesa;

}

module.exports = {
    generarJWT
}