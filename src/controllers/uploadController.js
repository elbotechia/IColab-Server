import { matchedData } from "express-validator";
import { handleHttpError } from "../errors/handleError.js";
import { Storage } from "../models/schemas/storageSchema.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const PUBLIC_URL = process.env.BASE_URL || "http://localhost:3003/";
const STORAGE_PATH = process.env.STORAGE_PATH || "STORAGE";

/**
 * POST - Upload de arquivo
 * Faz upload de um arquivo e salva no sistema de storage
 */
export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        
        if (!file) {
            return res.status(400).json({ 
                message: "Nenhum arquivo foi enviado.",
                error: "NO_FILE_UPLOADED" 
            });
        }

        console.log('Arquivo recebido:', file);

        // Dados do arquivo para salvar no banco
        const fileData = {
            url: `${PUBLIC_URL}storage/${file.filename}`,
            filename: file.filename,
            originalName: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            uploadedAt: new Date()
        };

        // Salva as informações do arquivo no banco de dados
        const data = await Storage.create(fileData);
        
        res.status(201).json({ 
            message: "Arquivo carregado com sucesso.",
            data: data,
            fileInfo: {
                id: data._id,
                filename: file.filename,
                originalName: file.originalname,
                size: file.size,
                url: fileData.url
            }
        });

    } catch (error) {
        console.error('Erro no upload:', error);
        
        // Remove o arquivo se houve erro ao salvar no banco
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error('Erro ao remover arquivo após falha:', unlinkError);
            }
        }
        
        handleHttpError(res, "ERROR_UPLOAD_FILE", error);
    }
};

/**
 * GET - Buscar arquivo por ID
 * Retorna as informações de um arquivo específico do storage
 */
export const getFileById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                message: "ID do arquivo é obrigatório." 
            });
        }

        const data = await Storage.findById(id);
        
        if (!data) {
            return res.status(404).json({ 
                message: "Arquivo não encontrado." 
            });
        }

        res.status(200).json({ 
            message: "Arquivo encontrado.",
            data: data 
        });

    } catch (error) {
        console.error('Erro ao buscar arquivo:', error);
        handleHttpError(res, "ERROR_GET_FILE", error);
    }
};

/**
 * GET - Download de arquivo por ID
 * Faz o download do arquivo físico baseado no ID do storage
 */
export const downloadFileById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                message: "ID do arquivo é obrigatório." 
            });
        }

        // Busca as informações do arquivo no banco
        const fileInfo = await Storage.findById(id);
        
        if (!fileInfo) {
            return res.status(404).json({ 
                message: "Arquivo não encontrado no banco de dados." 
            });
        }

        // Caminho completo do arquivo
        const filePath = path.join(STORAGE_PATH, fileInfo.filename);
        
        // Verifica se o arquivo existe fisicamente
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ 
                message: "Arquivo físico não encontrado.",
                filename: fileInfo.filename 
            });
        }

        // Define o nome para download (usa o nome original se disponível)
        const downloadName = fileInfo.originalName || fileInfo.filename;
        
        // Configura headers para download
        res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
        res.setHeader('Content-Type', fileInfo.mimetype || 'application/octet-stream');
        
        // Envia o arquivo
        res.sendFile(path.resolve(filePath), (err) => {
            if (err) {
                console.error('Erro ao enviar arquivo:', err);
                if (!res.headersSent) {
                    return res.status(500).json({ 
                        message: "Erro ao fazer download do arquivo." 
                    });
                }
            }
        });

    } catch (error) {
        console.error('Erro no download:', error);
        if (!res.headersSent) {
            handleHttpError(res, "ERROR_DOWNLOAD_FILE", error);
        }
    }
};

/**
 * GET - Servir arquivo por ID (visualização)
 * Serve o arquivo para visualização no navegador
 */
export const serveFileById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                message: "ID do arquivo é obrigatório." 
            });
        }

        // Busca as informações do arquivo no banco
        const fileInfo = await Storage.findById(id);
        
        if (!fileInfo) {
            return res.status(404).json({ 
                message: "Arquivo não encontrado no banco de dados." 
            });
        }

        // Caminho completo do arquivo
        const filePath = path.join(STORAGE_PATH, fileInfo.filename);
        
        // Verifica se o arquivo existe fisicamente
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ 
                message: "Arquivo físico não encontrado.",
                filename: fileInfo.filename 
            });
        }

        // Define o content-type baseado no mimetype
        if (fileInfo.mimetype) {
            res.setHeader('Content-Type', fileInfo.mimetype);
        }
        
        // Serve o arquivo para visualização
        res.sendFile(path.resolve(filePath), (err) => {
            if (err) {
                console.error('Erro ao servir arquivo:', err);
                if (!res.headersSent) {
                    return res.status(500).json({ 
                        message: "Erro ao servir arquivo." 
                    });
                }
            }
        });

    } catch (error) {
        console.error('Erro ao servir arquivo:', error);
        if (!res.headersSent) {
            handleHttpError(res, "ERROR_SERVE_FILE", error);
        }
    }
};

/**
 * DELETE - Remover arquivo por ID
 * Remove o arquivo tanto do banco quanto do sistema de arquivos
 */
export const deleteFileById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                message: "ID do arquivo é obrigatório." 
            });
        }

        // Busca e remove do banco de dados
        const fileInfo = await Storage.findByIdAndDelete(id);
        
        if (!fileInfo) {
            return res.status(404).json({ 
                message: "Arquivo não encontrado no banco de dados." 
            });
        }

        // Remove o arquivo físico
        const filePath = path.join(STORAGE_PATH, fileInfo.filename);
        
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log('Arquivo físico removido:', filePath);
            } catch (unlinkError) {
                console.error('Erro ao remover arquivo físico:', unlinkError);
                // Mesmo com erro na remoção física, continua pois já foi removido do banco
            }
        }

        res.status(200).json({ 
            message: "Arquivo removido com sucesso.",
            deletedFile: {
                id: fileInfo._id,
                filename: fileInfo.filename,
                originalName: fileInfo.originalName
            }
        });

    } catch (error) {
        console.error('Erro ao deletar arquivo:', error);
        handleHttpError(res, "ERROR_DELETE_FILE", error);
    }
};