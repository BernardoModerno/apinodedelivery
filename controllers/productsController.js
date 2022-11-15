const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');


module.exports = {
    
    findByCategory(req, res) {
        const id_category = req.params.id_category;

        Product.findByCategory(id_category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error ao listar as categorias',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },

    create(req, res) {

        const product = JSON.parse(req.body.product); // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        const files = req.files;
        
        let inserts = 0; 
        
        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Error ao registrar o produto não tem imagens',
            });
        }
        else {
            Product.create(product, (err, id_product) => {

        
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Houve um error com a criação do producto',
                        error: err
                    });
                }
                
                product.id = id_product;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;
                        const url = await storage(file, path);

                        if (url != undefined && url != null) { // CRIAR A IMAGEM EM FIREBASE
                            if (inserts == 0) { //IMAGEM 1
                                product.image1 = url;
                            }
                            else if (inserts == 1) { //IMAGEM 2
                                product.image2 = url;
                            }
                            else if (inserts == 2) { //IMAGEM 3
                                product.image3 = url;
                            }
                        }

                        await Product.update(product, (err, data) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Houve um error com o registro do produto',
                                    error: err
                                });
                            }

                            inserts = inserts + 1;

                            if (inserts == files.length) { // TERMINOU DE ARMAZENAR AS TRES IMAGENS
                                return res.status(201).json({
                                    success: true,
                                    message: 'O produto se armazenou corretamente',
                                    data: data
                                });
                            }

                        });
                    });
                }
    
                start();
    
            });
        }

    },

    update(req, res) {
        const product = req.body;

        Product.update(product, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error com o registro do produto',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'O produto se atualizou corretamente',
                data: data
            });
        })
    },
    updateWithImage(req, res) {
        const product = JSON.parse(req.body.product); // CAPTURA OS DADOS QUE ENVIA O CLIENTE

        const files = req.files;
        
        let inserts = 0; 
        
        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Error ao registrar o produto não tem imagens',
            });
        }
        else {
            Product.update(product, (err, id_product) => {

                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Houve um error com a actualização do produto',
                        error: err
                    });
                }
                
                product.id = id_product;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;
                        const url = await storage(file, path);

                        if (url != undefined && url != null) { // CRIAR A IMAGEM EM FIREBASE
                            if (inserts == 0) { //IMAGEM 1
                                product.image1 = url;
                            }
                            else if (inserts == 1) { //IMAGEM 2
                                product.image2 = url;
                            }
                            else if (inserts == 2) { //IMAGEM 3
                                product.image3 = url;
                            }
                        }

                        await Product.update(product, (err, data) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Houve um error com a actualização do produto',
                                    error: err
                                });
                            }

                            inserts = inserts + 1;

                            if (inserts == files.length) { // TERMINOU DE ARMAZENAR AS TRES IMAGENS
                                return res.status(201).json({
                                    success: true,
                                    message: 'O produto se atualizou corretamente',
                                    data: data
                                });
                            }

                        });
                    });
                }
    
                start();
    
            });
        }
    },

    delete(req, res) {
        const id = req.params.id;

        Product.delete(id, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error com ao eliminar o produto',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'O producto se eliminou corretamente',
                data: `${id}`
            });
        });
    },

}