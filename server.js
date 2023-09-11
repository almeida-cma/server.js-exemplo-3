const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const db = new sqlite3.Database('./agendaDatabase.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS AGENDA (id_agenda INTEGER PRIMARY KEY, dt_agenda TEXT, hora_agenda TEXT, descricao_agenda TEXT)");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/agenda', (req, res) => {
    const { dt_agenda, hora_agenda, descricao_agenda } = req.body;

    const stmt = db.prepare("INSERT INTO AGENDA (dt_agenda, hora_agenda, descricao_agenda) VALUES (?, ?, ?)");
    stmt.run(dt_agenda, hora_agenda, descricao_agenda, (err) => {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }
        res.send({ message: 'Agenda adicionada com sucesso!' });
    });
    stmt.finalize();
});

app.get('/agenda', (req, res) => {
    db.all("SELECT * FROM AGENDA", (err, rows) => {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }
        res.send(rows);
    });
});

app.put('/agenda/:id_agenda', (req, res) => {
    const { dt_agenda, hora_agenda, descricao_agenda } = req.body;

    const stmt = db.prepare("UPDATE AGENDA SET dt_agenda = ?, hora_agenda = ?, descricao_agenda = ? WHERE id_agenda = ?");
    stmt.run(dt_agenda, hora_agenda, descricao_agenda, req.params.id_agenda, (err) => {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }
        res.send({ message: 'Agenda atualizada com sucesso!' });
    });
    stmt.finalize();
});

app.delete('/agenda/:id_agenda', (req, res) => {
    const stmt = db.prepare("DELETE FROM AGENDA WHERE id_agenda = ?");
    stmt.run(req.params.id_agenda, (err) => {
        if (err) {
            res.status(400).send({ error: err.message });
            return;
        }
        res.send({ message: 'Agenda removida com sucesso!' });
    });
    stmt.finalize();
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
