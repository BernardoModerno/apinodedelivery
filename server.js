const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');

/*
* IMPORTAR ROTAS
*/
const usersRoutes = require('./routes/userRoutes');

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.disable('x-powered-by');

app.set('port', port);

/*
* Chamar ROTAS
*/
usersRoutes(app);

server.listen(3000, '172.22.48.1' || 'localhost', function() {
    console.log('Aplicação de NodeJS ' +port+ ' Iniciada...')
});

app.get('/', (req, res) => {
    res.send('Rota raiz do Backend');
});

app.get('/teste', (req, res) => {
    res.send('Rota teste do Backend');
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}
