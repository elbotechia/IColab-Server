import { Person } from '../models/schemas/personsSchema.js';
import bcrypt from 'bcryptjs';

export class PersonController {
    async create(req, res) {
        try {
            // Hash the password before saving
            if (req.body.password) {
                const saltRounds = 10;
                req.body.passwordHash = await bcrypt.hash(req.body.password, saltRounds);
                delete req.body.password; // Remove plain password from body
            }

            const person = new Person(req.body);
            const savedPerson = await person.save();
            
            // Remove password hash from response
            const personResponse = savedPerson.toObject();
            delete personResponse.passwordHash;
            
            res.status(201).json({
                success: true,
                message: 'Person created successfully',
                data: personResponse
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Person already exists (duplicate username or email)'
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Error creating person',
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
            
            if (req.query.role) {
                filter.roles = { $in: [req.query.role] };
            }
            
            if (req.query.search) {
                filter.$or = [
                    { username: { $regex: req.query.search, $options: 'i' } },
                    { firstName: { $regex: req.query.search, $options: 'i' } },
                    { lastName: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } }
                ];
            }

            const persons = await Person
                .find(filter)
                .select('-passwordHash') // Exclude password hash from results
                .populate('avatarId')
                .populate('coverId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Person.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: persons,
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
                message: 'Error retrieving persons',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const person = await Person
                .findById(req.params.id)
                .select('-passwordHash') // Exclude password hash
                .populate('avatarId')
                .populate('coverId');

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Person not found'
                });
            }

            res.status(200).json({
                success: true,
                data: person
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving person',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            // Hash password if provided
            if (req.body.password) {
                const saltRounds = 10;
                req.body.passwordHash = await bcrypt.hash(req.body.password, saltRounds);
                delete req.body.password;
            }

            const person = await Person.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).select('-passwordHash')
             .populate('avatarId')
             .populate('coverId');

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Person not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Person updated successfully',
                data: person
            });
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({
                    success: false,
                    message: 'Person already exists (duplicate username or email)'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error updating person',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const person = await Person.findByIdAndDelete(req.params.id);

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Person not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Person deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting person',
                error: error.message
            });
        }
    }

    async getByUsername(req, res) {
        try {
            const person = await Person
                .findOne({ username: req.params.username })
                .select('-passwordHash')
                .populate('avatarId')
                .populate('coverId');

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Person not found'
                });
            }

            res.status(200).json({
                success: true,
                data: person
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving person',
                error: error.message
            });
        }
    }

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            
            const person = await Person.findById(req.params.id);
            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Person not found'
                });
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, person.passwordHash);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const saltRounds = 10;
            const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

            await Person.findByIdAndUpdate(req.params.id, { passwordHash: newPasswordHash });

            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error changing password',
                error: error.message
            });
        }
    }
}
