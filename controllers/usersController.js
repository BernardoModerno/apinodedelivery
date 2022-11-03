const User = require('../models/user');

module.exports = {

    register(req, res) {

        const user = req.body; // Captura os dados que o cliente envia
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um erro com o registro do usuário',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'O registro se realizou corretamente',
                data: data // O ID do novo usuário que se registrou
            });

        });

    }

}