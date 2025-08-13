import { Person } from '../models/schemas/personsSchema.js';
import bcrypt from 'bcryptjs';

export class PersonController {
    async create(req, res) {
        try {
            // Convert single role to roles array if provided
            if (req.body.role && !req.body.roles) {
                req.body.roles = [req.body.role];
                delete req.body.role;
            }

            // Process social media data - handle both flat fields and nested object
            if (!req.body.social) {
                req.body.social = {};
            }

            // Process flat social media fields from frontend
            const socialFields = ['github', 'linkedin', 'twitter', 'instagram', 'facebook'];
            socialFields.forEach(field => {
                if (req.body[field]) {
                    req.body.social[field] = req.body[field].trim() || 'NÃO INFORMADO';
                    delete req.body[field];
                } else if (!req.body.social[field]) {
                    req.body.social[field] = 'NÃO INFORMADO';
                }
            });

            // Set default values
            if (!req.body.bio || req.body.bio.trim() === '') {
                req.body.bio = 'Biografia não disponível';
            }

            if (!req.body.hex) {
                req.body.hex = '#3498db';
            }

            if (req.body.newsletter === undefined) {
                req.body.newsletter = false;
            }

            // Hash the password before saving
            if (req.body.confirmPassword) {
                const saltRounds = 12;
                req.body.passwordHash = await bcrypt.hash(req.body.confirmPassword, saltRounds);
                delete req.body.confirmPassword;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Password is required'
                });
            }

            // Sanitize input data
            if (req.body.username) req.body.username = req.body.username.trim();
            if (req.body.firstName) req.body.firstName = req.body.firstName.trim();
            if (req.body.lastName) req.body.lastName = req.body.lastName.trim();
            if (req.body.bio) req.body.bio = req.body.bio.trim();

            // Set default role if not provided
            if (!req.body.roles || req.body.roles.length === 0) {
                req.body.roles = ['user'];
            }

            const person = new Person(req.body);
            const savedPerson = await person.save();
            
            res.status(201).json({
                success: true,
                message: 'Pessoa criada com sucesso',
                data: savedPerson.toJSON()
            });
        } catch (error) {
            console.error('Error creating person:', error);
            
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                return res.status(409).json({
                    success: false,
                    message: `${field === 'email' ? 'Email' : 'Nome de usuário'} já existe`,
                    field: field
                });
            }
            
            if (error.name === 'ValidationError') {
                console.log(error)
                const errors = Object.values(error.errors).map(err => ({
                    field: err.path,
                    message: err.message
                }));
                console.log(errors)
                return res.status(400).json(
                    {
                    success: false,
                    message: 'Erro de validação',
                    errors: errors
                });
            }
            
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    async getAll(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            
            const filter = {};
            
            // Filter by role
            if (req.query.role) {
                filter.roles = { $in: [req.query.role] };
            }
            
            // Search functionality
            if (req.query.search) {
                filter.$or = [
                    { username: { $regex: req.query.search, $options: 'i' } },
                    { firstName: { $regex: req.query.search, $options: 'i' } },
                    { lastName: { $regex: req.query.search, $options: 'i' } },
                    { email: { $regex: req.query.search, $options: 'i' } }
                ];
            }

            // Filter by username (for uniqueness check)
            if (req.query.username) {
                filter.username = req.query.username;
            }

            // Filter by email (for uniqueness check)  
            if (req.query.email) {
                filter.email = req.query.email;
            }

            // Filter by active status
            if (req.query.isActive !== undefined) {
                filter.isActive = req.query.isActive === 'true';
            }

            const persons = await Person
                .find(filter)
                .populate('avatarId')
                .populate('coverId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = await Person.countDocuments(filter);

            // Use toJSON method to automatically exclude passwordHash
            const personsData = persons.map(person => person.toJSON());

            res.status(200).json({
                success: true,
                data: personsData,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(total / limit),
                    totalItems: total,
                    itemsPerPage: limit
                }
            });
        } catch (error) {
            console.error('Error retrieving persons:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao recuperar pessoas',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    async getById(req, res) {
        try {
            const person = await Person
                .findById(req.params.id)
                .populate('avatarId')
                .populate('coverId');

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Pessoa não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: person.toJSON()
            });
        } catch (error) {
            console.error('Error retrieving person:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao recuperar pessoa',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    async update(req, res) {
        try {
            // Hash password if provided
            if (req.body.password) {
                const saltRounds = 12;
                req.body.passwordHash = await bcrypt.hash(req.body.password, saltRounds);
                delete req.body.password;
                delete req.body.confirmPassword;
            }

            // Process social media data if provided
            if (req.body.github || req.body.linkedin || req.body.twitter || req.body.instagram || req.body.facebook) {
                if (!req.body.social) req.body.social = {};
                
                const socialFields = ['github', 'linkedin', 'twitter', 'instagram', 'facebook'];
                socialFields.forEach(field => {
                    if (req.body[field] !== undefined) {
                        req.body.social[field] = req.body[field].trim() || 'NÃO INFORMADO';
                        delete req.body[field];
                    }
                });
            }

            const person = await Person.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('avatarId')
             .populate('coverId');

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Pessoa não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Pessoa atualizada com sucesso',
                data: person.toJSON()
            });
        } catch (error) {
            console.error('Error updating person:', error);
            
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                return res.status(409).json({
                    success: false,
                    message: `${field === 'email' ? 'Email' : 'Nome de usuário'} já existe`
                });
            }

            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => ({
                    field: err.path,
                    message: err.message
                }));
                return res.status(400).json({
                    success: false,
                    message: 'Erro de validação',
                    errors: errors
                });
            }

            res.status(500).json({
                success: false,
                message: 'Erro ao atualizar pessoa',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    async delete(req, res) {
        try {
            const person = await Person.findByIdAndDelete(req.params.id);

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Pessoa não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Pessoa excluída com sucesso'
            });
        } catch (error) {
            console.error('Error deleting person:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao excluir pessoa',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

    async getByUsername(req, res) {
        try {
            const person = await Person
                .findOne({ username: req.params.username })
                .populate('avatarId')
                .populate('coverId');

            if (!person) {
                return res.status(404).json({
                    success: false,
                    message: 'Pessoa não encontrada'
                });
            }

            res.status(200).json({
                success: true,
                data: person.toJSON()
            });
        } catch (error) {
            console.error('Error retrieving person by username:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao recuperar pessoa',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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
                    message: 'Pessoa não encontrada'
                });
            }

            // Verify current password using schema method
            const isCurrentPasswordValid = await person.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: 'Senha atual incorreta'
                });
            }

            // Use schema method to change password
            await person.changePassword(newPassword);

            res.status(200).json({
                success: true,
                message: 'Senha alterada com sucesso'
            });
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao alterar senha',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }
        async signIn(req, res) {
        try {
            const { identifier, password } = req.body;

            // Find user by username or email
            const person = await Person.findOne({
                $or: [
                    { username: identifier },
                    { email: identifier }
                ]
            });

            if (!person) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Check if account is active
            if (!person.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Conta desativada. Entre em contato com o suporte.'
                });
            }

            // Verify password
            const isValidPassword = await person.comparePassword(password);
            
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Update last login
            person.lastLogin = new Date();
            await person.save();

            // Return user data (without password hash)
            const personData = person.toJSON();

            res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    person: personData,
                    lastLogin: person.lastLogin
                }
            });

        } catch (error) {
            console.error('Error during sign in:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            });
        }
    }

// ...existing code...
}
