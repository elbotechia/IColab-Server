import express, {Router} from "express";
import {ItemRouter} from './itemRouter.js'
import { MainController } from "../controllers/mainController.js";
import {ApiRouter} from "./apiRouter.js";
export class MainRouter {
    constructor() {
        this.router = express.Router();
        this.apiRouter = new ApiRouter();
        this.mainController = new MainController();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.mainController.getMain.bind(this.mainController));
        // Add more routes here as needed
        this.router.use("/api", this.apiRouter.getRouter());    
    }

    getRouter() {
        return this.router;
    }
}