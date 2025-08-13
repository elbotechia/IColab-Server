import express from "express";
import * as uploadController from "../controllers/uploadController.js";
import { uploadMiddleware } from "../config/multer.js";
import { validatorGetItem, validatorDeleteItem } from "../validators/storageValidator.js";

export class UploadRouter {
    constructor() {
        this.router = express.Router();
        this.setRoutes();
    }

    setRoutes() {
        /**
         * POST /uploads - Upload de arquivo
         * Faz upload de um arquivo usando multer
         */
        this.router.post(
            '/',
            uploadMiddleware.single('file'), // Nome do campo do formulário
            uploadController.uploadFile
        );

        /**
         * GET /uploads/:id - Buscar informações do arquivo
         * Retorna as informações de um arquivo específico
         */
        this.router.get(
            '/:id',
            validatorGetItem,
            uploadController.getFileById
        );

        /**
         * GET /uploads/:id/download - Download do arquivo
         * Faz download do arquivo baseado no ID
         */
        this.router.get(
            '/:id/download',
            validatorGetItem,
            uploadController.downloadFileById
        );

        /**
         * GET /uploads/:id/view - Visualizar arquivo
         * Serve o arquivo para visualização no navegador
         */
        this.router.get(
            '/:id/view',
            validatorGetItem,
            uploadController.serveFileById
        );

        /**
         * DELETE /uploads/:id - Remover arquivo
         * Remove o arquivo do storage e do sistema de arquivos
         */
        this.router.delete(
            '/:id',
            validatorDeleteItem,
            uploadController.deleteFileById
        );
    }

    getRouter() {
        return this.router;
    }
}
