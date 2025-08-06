import { v4 as uuidv4 } from "uuid";

export class MainController {
    // Não chame métodos no construtor

    async getMain(req, res) {
        try {
            res.status(200).sendFile("index.html", { root: "public" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error 500" });
        }
    }
}