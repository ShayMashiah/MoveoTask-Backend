import initApp from "./server.js"; 
const port = process.env.PORT;  

initApp().then(({ app, server }) => {
    
    server.listen(port, () => {
        console.log("Server is running on port " +port);
    });
}).catch(err => {
    console.error("Failed to start application:", err);
});