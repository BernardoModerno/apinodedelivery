const usersController = require('../controllers/usersController');

module.exports = (app) => {

    // GET -> Obter dados
    // POST -> Armazenar dados
    // PUT -> atualizar dados
    // DELETE -> excluir dados

    app.post('/api/users/create', usersController.register);
    app.post('/api/users/login', usersController.login);

}