import { Post } from '../models/schemas/postSchema.js';

export class PostController {
    async create(req, res) {
        try {
            const post = new Post(req.body);
            const savedPost = await post.save();
            
            const populatedPost = await Post
                .findById(savedPost._id)
                .populate('authorId', '-passwordHash')
                .populate('mediaIds')
                .populate('comments');
            
            res.status(201).json({
                success: true,
                message: 'Post created successfully',
                data: populatedPost
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating post',
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
            
            // Include deleted posts if requested
            const includeDeleted = req.query.includeDeleted === 'true';
            
            if (req.query.authorId) {
                filter.authorId = req.query.authorId;
            }
            
            if (req.query.tag) {
                filter.tags = { $in: [req.query.tag] };
            }
            
            if (req.query.search) {
                filter.$or = [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { content: { $regex: req.query.search, $options: 'i' } },
                    { tags: { $in: [new RegExp(req.query.search, 'i')] } }
                ];
            }

            let query = Post.find(filter);
            
            if (includeDeleted) {
                query = Post.findWithDeleted(filter);
            }

            const posts = await query
                .populate('authorId', '-passwordHash')
                .populate('mediaIds')
                .populate('comments')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total = includeDeleted 
                ? await Post.countDocumentsWithDeleted(filter)
                : await Post.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: posts,
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
                message: 'Error retrieving posts',
                error: error.message
            });
        }
    }

    async getById(req, res) {
        try {
            const includeDeleted = req.query.includeDeleted === 'true';
            
            let post;
            if (includeDeleted) {
                post = await Post.findOneWithDeleted({ _id: req.params.id })
                    .populate('authorId', '-passwordHash')
                    .populate('mediaIds')
                    .populate('comments');
            } else {
                post = await Post.findById(req.params.id)
                    .populate('authorId', '-passwordHash')
                    .populate('mediaIds')
                    .populate('comments');
            }

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            res.status(200).json({
                success: true,
                data: post
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving post',
                error: error.message
            });
        }
    }

    async update(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            ).populate('authorId', '-passwordHash')
             .populate('mediaIds')
             .populate('comments');

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post updated successfully',
                data: post
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating post',
                error: error.message
            });
        }
    }

    async delete(req, res) {
        try {
            const post = await Post.findById(req.params.id);

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            await post.delete(); // Soft delete

            res.status(200).json({
                success: true,
                message: 'Post deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting post',
                error: error.message
            });
        }
    }

    async restore(req, res) {
        try {
            const post = await Post.findOneWithDeleted({ _id: req.params.id });

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            if (!post.deleted) {
                return res.status(400).json({
                    success: false,
                    message: 'Post is not deleted'
                });
            }

            await post.restore();

            const restoredPost = await Post.findById(req.params.id)
                .populate('authorId', '-passwordHash')
                .populate('mediaIds')
                .populate('comments');

            res.status(200).json({
                success: true,
                message: 'Post restored successfully',
                data: restoredPost
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error restoring post',
                error: error.message
            });
        }
    }

    async like(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params.id,
                { $inc: { likes: 1 } },
                { new: true }
            );

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post liked successfully',
                data: { likes: post.likes }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error liking post',
                error: error.message
            });
        }
    }

    async dislike(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params.id,
                { $inc: { dislikes: 1 } },
                { new: true }
            );

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Post disliked successfully',
                data: { dislikes: post.dislikes }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error disliking post',
                error: error.message
            });
        }
    }

    async addComment(req, res) {
        try {
            const post = await Post.findByIdAndUpdate(
                req.params.id,
                { $push: { comments: req.body.commentId } },
                { new: true }
            ).populate('authorId', '-passwordHash')
             .populate('mediaIds')
             .populate('comments');

            if (!post) {
                return res.status(404).json({
                    success: false,
                    message: 'Post not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Comment added to post successfully',
                data: post
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error adding comment to post',
                error: error.message
            });
        }
    }
}
