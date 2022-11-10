const User = require('../models/user');
const Rol = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const storage = require('../utils/cloud_storage');

module.exports = {

    login(req, res) {

        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {
            
            console.log('Error ', err);
            console.log('USUÁRIO ', myUser);

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error com o registro do usuário',
                    error: err
                });
            }

            if (!myUser) {
                return res.status(401).json({ // O CLIENTE NÃO TEM AUTORIZAÇÃO PARA REALIZAR ESTA PETIÇÃO (401)
                    success: false,
                    message: 'O email não foi encontrado'
                });
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {});

                const data = {
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: JSON.parse(myUser.roles)
                }

                return res.status(201).json({
                    success: true,
                    message: 'O usuário foi autenticado',
                    data: data // O ID DO NOVO USUÁRIO QUE SE REGISTROU
                });

            }
            else {
                return res.status(401).json({ // O CLIENTE NÃO TEM AUTORIZAÇÃO PARA REALIZAR ESTA PETIÇÃO (401)
                    success: false,
                    message: 'O password está incorreto'
                });
            }

        });

    },

    register(req, res) {

        const user = req.body; // CAPTURA OS DADOS QUE O CLIENTE ENVIA
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error com o registro do usuário',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'O registro se realizou corretamente',
                data: data // O ID DO NOVO USUÁRIO QUE SE REGISTROU
            });

        });

    },
    async registerWithImage(req, res) {

        const user = JSON.parse(req.body.user); // CAPTURA OS DADOS QUE O CLIENTE ENVIA

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.create(user, (err, data) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error com o registro do usuario',
                    error: err
                });
            }

        
            user.id = `${data}`;
            const token = jwt.sign({id: user.id, email: user.email}, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            Rol.create(user.id, 3, (err, data) => {
                
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Houve um error com o registro do rol de usuario',
                        error: err
                    });
                }
                
                return res.status(201).json({
                    success: true,
                    message: 'O registro se realizou corretamente',
                    data: user
                });

            });

           

        });

    },

    async updateWithImage(req, res) {

        const user = JSON.parse(req.body.user); // CAPTURA OS DADOS QUE O CLIENTE ENVIA

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                user.image = url;
            }
        }

        User.update(user, (err, data) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error com o registro do usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'O usuario se atualizou corretamente',
                data: user
            });
        

        });

    },

    async updateWithoutImage(req, res) {

        const user = req.body; // CAPTURA OS DADOS QUE O CLIENTE ENVIA
        console.log('Dados do CLIENTE ', user);

        User.updateWithoutImage(user, (err, data) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error com o registro do usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'O usuario se atualizou corretamente',
                data: user
            });
        

        });

    },

}