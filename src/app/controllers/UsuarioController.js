import Usuario from "../models/Usuario";

class UsuarioController {
    async UsuarioExists(req, res) {

        const usuarioExists = await Usuario.findOne({
            where: {usuario: req.params.usuario},
        });
    

        if (usuarioExists) {
            return res.status(200).json({ error: true });
        }else{
            return res.status(200).json({ error: false });
        }
    }

    async EmailExists(req, res) {

        const emailExists = await Usuario.findOne({
            where: {email: req.params.email},
        });


        if (emailExists) {
            return res.status(200).json({ error: true });
        }else{
            return res.status(200).json({ error: false });
        }
    }
}
export default new UsuarioController();
