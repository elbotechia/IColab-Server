import { InstitutionModel } from '../models/schemas/institutionSchema.js';

export class InstitutionController {
    async create(req, res) {
        try {
            const institution = new InstitutionModel(req.body);
            const savedInstitution = await institution.save();
            
            res.status(201).json({
                success: true,
                message: 'Institution created successfully',
                data: savedInstitution
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Institution already exists (duplicate CNPJ, email or razão social)'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Error creating institution',
                error: error.message
            });
        }
    }

    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            
            const filter = {};
            
            if (req.query.dominio) {
                filter.dominio = { $in: [req.query.dominio] };
            }
            
            if (req.query.search) {
                filter.$or = [
                    { razaoSocial: { $regex: req.query.search, $options: 'i' } },
                    { nomeFantasia: { $regex: req.query.search, $options: 'i' } },
                    { abbr: { $regex: req.query.search, $options: 'i' } }
                ];
            }

            const institutions = await InstitutionModel
                .find(filter)
                .populate('mediasId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await InstitutionModel.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: institutions,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving institutions',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const institution = await InstitutionModel
                .findById(req.params.id)
                .populate('mediasId');

            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institution not found'
                });
            }

            res.status(200).json({
                success: true,
                data: institution
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving institution',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const institution = await InstitutionModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('mediasId');

            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institution not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Institution updated successfully',
                data: institution
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Institution already exists (duplicate CNPJ, email or razão social)'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error updating institution',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const institution = await InstitutionModel.findByIdAndDelete(req.params.id);

            if (!institution) {
                return res.status(404).json({
                    success: false,
                    message: 'Institution not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Institution deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting institution',
                error: error.message
            });
        }
    }

    async getByDomain(req, res) {
        try {
            const { domain } = req.params;
            
            const institutions = await InstitutionModel
                .find({ dominio: { $in: [domain] } })
                .populate('mediasId')
                .sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: institutions,
                count: institutions.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving institutions by domain',
                error: error.message
            });
        }
    }
}
