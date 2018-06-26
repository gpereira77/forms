const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;

const app = express();

//cria conexão com o banco de dados
//e a disponibiliza na variável req.db
app.use(expressMongoDb('mongodb://formulario:formulario123@165.227.221.155/formulario'));

//converte os dados presentes no corpo da requisição em JSON
//e os disponibiliza na variável req.body
app.use(bodyParser.json());

//adiciona o header Access-Control-Allow-Origin:*
//que libera acesso para essa API por qualquer domínio
app.use(cors());

// busca todos os sabores de churros
app.get('/formulario', (req, res) => {
    req.db.collection('clientes').find().toArray((err, data) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        res.send(data);
    });
});

// busca um sabor de churro pelo id
app.get('/formulario/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };
    
    req.db.collection('clientes').findOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        if(!data){
            res.status(404).send();
            return;
        }
        
        res.send(data);
    });
});

app.get('/formulario/nome/:nome', (req, res) => {
    let query = {
        nome: req.params.nome
    };
    
    req.db.collection('clientes').find(query).toArray((err, data) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        if(!data){
            res.status(404).send();
            return;
        }
        
        res.send(data);
    });
});



//insere um novo sabor de churro
app.post('/cadastro', (req, res) => {
    //remove dados indesejados do body
    let formulario = {
        nome: req.body.nome,
        endereco: req.body.endereco,
        telefone: req.body.telefone
    };
    
    // exemplo de validação de email
    // if(req.body.email.indexOf('@') == -1){
    //     res.status(400).send({mensagem: 'Email inválido'});
    //     return;
    // }
    
    req.db.collection('clientes').insert(formulario, (err) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        res.send(req.body);
    });
});

// atualiza um sabor de churro pelo id
app.put('/formulario/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };
    
    let formulario = {
        nome: req.body.nome,
        endereco: req.body.endereco,
        telefone: req.body.telefone
    };
    req.db.collection('clientes').updateOne(query, formulario, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        res.send(data);
    });
});

// deleta um sabor de churro pelo id
app.delete('/formulario/:id', (req, res) => {
    let query = {
        _id: ObjectID(req.params.id)
    };
    
    req.db.collection('clientes').deleteOne(query, (err, data) => {
        if(err){
            res.status(500).send();
            return;
        }
        
        res.send(data);
    });
});

app.listen(process.env.PORT || 3000, () => console.log('aplicação iniciada'));