import mongoose from 'mongoose';

const CodeBlockSchema = new mongoose.Schema({
    index:
    { 
        type: Number, 
        required: true
    },
    title: 
    { 
        type: String, 
        required: true 
    },
    assignment: 
    { 
        type: String,
        required: true },
    solution:
    { 
        type: String, 
        required: false 
    }, 
});

const CodeBlock = mongoose.model('CodeBlock', CodeBlockSchema);

export default CodeBlock;
