const { response } = require('express');
const Evento = require('../models/Eventos');

const getEventos = async ( req, res=response ) => {

    const eventos = await Evento.find()
                                .populate('user','name');    

    res.status(200).json({
        ok: true,
        eventos
    });
}
const crearEvento = async ( req, res=response ) => {
    
    const evento = new Evento( req.body );
  /*   //Verificar que tenga el evento
    console.log(req.body);
 */
    try {
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        res.status(201).json({
            ok: true,
            msg:eventoGuardado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    }
    
}
const actualizarEvento = async ( req, res=response ) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    //console.log(req.params);
    try {
      
      const evento = await Evento.findById(eventoId);

      if ( !evento ) {
        return res.status(404).json({
            ok:false,
            msg: 'Evento no existe por ese id'
        });
      }

      if ( evento.user.toString() !== uid ) {
        return res.status(401).json({
            ok:false,
            msg:'No tiene privilegio de editar este evento'
        });
      }

      const nuevoEvento = {
        ...req.body,
         user: uid
      }

      const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );

      res.status(200).json({
        ok: true,
        evento: eventoActualizado
      });

    } catch (error) {
       console.log(error);
       res.status(500).json({
        ok:false,
            msg: 'Hable con el administrador'
       });
    }
    
}
const eliminarEvento = async ( req, res=response ) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {

      const evento = await Evento.findById(eventoId);

      if ( !evento ) {
        return res.status(404).json({
            ok:false,
            msg: 'Evento no existe por ese id'
        });
      }
      
      if ( evento.user.toString() !== uid ) {
        return res.status(401).json({
            ok:false,
            msg:'No tiene privilegio de editar este evento'
        });
      }

      const eventoEliminado = await Evento.findByIdAndRemove( eventoId );

      res.status(200).json({
        ok: true,
        eventoEliminado
      });
        
    } catch (error) {
       
       console.log(error);
       res.status(500).json({
        ok:false,
            msg: 'Hable con el administrador'
       });        

    }

}

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
}