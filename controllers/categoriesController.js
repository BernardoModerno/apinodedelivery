const Category = require('../models/category');
const storage = require('../utils/cloud_storage');

module.exports = {

    async getAll(req, res) {
        Category.getAll((err, data) => {
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

    async create(req, res) {

        const category = JSON.parse(req.body.category); // CAPTURA OS DADOS QUE O CLIENTE ENVIA

        const files = req.files;

        if (files.length > 0) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path);

            if (url != undefined && url != null) {
                category.image = url;
            }
        }

        Category.create(category, (err, id) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error com a criação da categoria',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'A categoria se criou corretamente',
                data: `${id}`
            });
        });

    },

    async delete(req, res) {
        const id = req.params.id;
        Category.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Houve um error no momento de eliminar uma categoria',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'A categoria se eliminou corretamente',
                data: `${id}`
            });
        });
    }
}