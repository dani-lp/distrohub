require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
const Distro = require('./models/distro');
const Tip = require('./models/tip');

const app = express();

const url = process.env.MONGODB_URI;
console.log('connecting to', url);
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });


// Middleware and handlers
app.use(express.json());
app.use(cors());

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'maformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }

    next(error);
}


// Routes
app.get('/api/distros', (request, response) => {
    Distro.find({}).then(distros => {
        response.json(distros);
    });
});

app.get('/api/distros/:id', (request, response, next) => {
    Distro.findOne({ name: request.params.id })
        .then(distro => {
            if (distro) {
                response.json(distro);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.put('/api/distros/:id', (request, response, next) => {
    const name = request.params.id;
    Distro.findOneAndUpdate({ name: name }, {$inc: {'votes': 1}}, { new: true })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

app.get('/api/tips', (request, response) => {
    Tip.find({}).then(tips => {
        response.json(tips);
    });
});

app.post('/api/tips', (request, response, next) => {
    const body = request.body;

    const tip = new Tip({
        author: body.author,
        content: body.content,
        date: new Date(),
    });

    tip.save()
        .then(savedTip => {
            response.json(savedTip);
        })
        .catch(error => next(error));
});


app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}/`);
    console.log(`Database at http://127.0.0.1:${PORT}/api/distros`);
});

// pwd: GHj0YagPcbahukLG