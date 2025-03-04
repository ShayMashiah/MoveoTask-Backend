import mongoose from 'mongoose';

const QASSchema = new mongoose.Schema({
    index: { 
        type: Number, 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    assignment: { 
        type: String, 
        required: true 
    },
    solution: { 
        type: String, 
        required: false 
    }, 
});

const CodeBlock = mongoose.model('QAS', QASSchema);

export default CodeBlock;

