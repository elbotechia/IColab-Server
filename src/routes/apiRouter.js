
import express from "express";
import { ApiController } from "../controllers/apiController.js";
import { ItemRouter } from "./itemRouter.js";
import { AssignatureRouter } from "./assignatureRouter.js";
import { InstitutionRouter } from "./institutionRouter.js";
import { PersonRouter } from "./personRouter.js";
import { PostRouter } from "./postRouter.js";
import { StorageRouter } from "./storageRouter.js";
import { TagRouter } from "./tagRouter.js";
import { CourseRouter } from "./courseRouter.js";
import { UploadRouter } from "./uploadRouter.js";

export class ApiRouter {
    constructor() {
        this.router = express.Router();
        this.apiController = new ApiController();
        
        // Initialize all routers
        this.itemRouter = new ItemRouter();
        this.assignatureRouter = new AssignatureRouter();
        this.institutionRouter = new InstitutionRouter();
        this.personRouter = new PersonRouter();
        this.postRouter = new PostRouter();
        this.storageRouter = new StorageRouter();
        this.tagRouter = new TagRouter();
        this.courseRouter = new CourseRouter();
        this.uploadRouter = new UploadRouter();
        
        this.initRoutes();
    }

    initRoutes() {
        // Main API route
        this.router.get("/", this.apiController.getMain.bind(this.apiController));
        
        // Entity routes
        this.router.use("/items", this.itemRouter.getRouter());
        this.router.use("/assignatures", this.assignatureRouter.getRouter());
        this.router.use("/institutions", this.institutionRouter.getRouter());
        this.router.use("/persons", this.personRouter.getRouter());
        this.router.use("/posts", this.postRouter.getRouter());
        this.router.use("/storage", this.storageRouter.getRouter());
        this.router.use("/tags", this.tagRouter.getRouter());
        this.router.use("/courses", this.courseRouter.getRouter());
        this.router.use("/uploads", this.uploadRouter.getRouter());
    }

    getRouter() {
        return this.router;
    }
}