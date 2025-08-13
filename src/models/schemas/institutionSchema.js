import { Model, Document } from "mongoose";

import mongoose from "mongoose";

const InstitutionSchema = new mongoose.Schema({
    razaoSocial: {
        type: String,
        required: true,
        unique: true
    },
    nomeFantasia: {
        type: String,
        required: true,
    },
    abbr: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
        unique: true,
    },
    dominio:{
        type: [String],
        enum: ["educacao", "ONG", "empresa", "comercio", "GOV", "politico", "industria"],
        default: ["educacao"]
    },
    enderecos:{
        type: [String],
        default: []
    },
    telefone: {
        type: [String],
        default: []
    },
    CNPJ: {
        type: String,
        required: true,
        unique: true
    },
     mediasId:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Storage',
            default: []
    }],
},{
    timestamps: true,
    versionKey: false
});

const InstitutionModel= mongoose.model("Institutions", InstitutionSchema);

export {  InstitutionModel };       