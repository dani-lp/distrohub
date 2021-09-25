const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message);
    });

const distroSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        required: true
    }
}, { collection: 'votes' });

distroSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

module.exports = mongoose.model('Distro', distroSchema);