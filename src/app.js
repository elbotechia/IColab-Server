import { Server } from "./models/server.js";

const run = ()=>{
    const server = new Server();
    server.listen();
}

run()