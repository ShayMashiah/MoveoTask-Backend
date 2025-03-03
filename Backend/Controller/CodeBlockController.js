import CodeBlock from '../Model/CodeBlockModel.js'; 

const createCodeBlock = async (req, res) => {
    const newCodeBlock = req.body;
    try {
        const codeBlock = await CodeBlock.create(newCodeBlock);
        res.status(201).json(codeBlock);
    } catch (error) {
        console.error(error);
        res.status(500).json("Server Error");
    }
}

const getCodeBlock = async (req, res) => {
    const { index } = req.params;
    try {
      const codeBlock = await CodeBlock.findOne({ index }); 
      if (!codeBlock) {
        return res.status(404).json("Code block not found");
      }
      res.status(200).json(codeBlock);
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  };
  

export default { getCodeBlock, createCodeBlock };
