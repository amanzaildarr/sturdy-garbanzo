import { Router, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { User, IUser } from '../models/User';
import { Database } from '../database/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { 
  validateUser, 
  validateUpdateUser, 
  validateUserId, 
  validateUserQuery 
} from '../middleware/validation';

export class UserController {
  private router: Router;
  private database: Database;

  constructor(database: Database) {
    this.router = Router();
    this.database = database;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // GET /api/users - List users with filters
    this.router.get('/', validateUserQuery, asyncHandler(this.getAllUsers.bind(this)));
    
    // GET /api/users/:id - Get user by ID
    this.router.get('/:id', validateUserId, asyncHandler(this.getUserById.bind(this)));
    
    // POST /api/users - Create new user
    this.router.post('/', validateUser, asyncHandler(this.createUser.bind(this)));
    
    // PUT /api/users/:id - Update user
    this.router.put('/:id', validateUpdateUser, asyncHandler(this.updateUser.bind(this)));
    
    // DELETE /api/users/:id - Delete user
    this.router.delete('/:id', validateUserId, asyncHandler(this.deleteUser.bind(this)));
  }

  private handleValidationErrors(req: Request): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw createError(`Validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400);
    }
  }

  // GET /api/users
  private async getAllUsers(req: Request, res: Response): Promise<void> {
    this.handleValidationErrors(req);

    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '10');
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search as string, $options: 'i' } },
        { email: { $regex: req.query.search as string, $options: 'i' } }
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-__v')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  }

  // GET /api/users/:id
  private async getUserById(req: Request, res: Response): Promise<void> {
    this.handleValidationErrors(req);

    const user = await User.findById(req.params.id).select('-__v').lean();
    
    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      data: { user }
    });
  }

  // POST /api/users
  private async createUser(req: Request, res: Response): Promise<void> {
    this.handleValidationErrors(req);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw createError('User with this email already exists', 409);
    }

    const user = await User.create(req.body);
    const userResponse = user.toObject();
    delete userResponse.__v;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: userResponse }
    });
  }

  // PUT /api/users/:id
  private async updateUser(req: Request, res: Response): Promise<void> {
    this.handleValidationErrors(req);

    // Check if email is being updated and if it already exists
    if (req.body.email) {
      const existingUser = await User.findOne({ 
        email: req.body.email, 
        _id: { $ne: req.params.id } 
      });
      if (existingUser) {
        throw createError('User with this email already exists', 409);
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true, 
        runValidators: true,
        select: '-__v'
      }
    ).lean();

    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user }
    });
  }

  // DELETE /api/users/:id
  private async deleteUser(req: Request, res: Response): Promise<void> {
    this.handleValidationErrors(req);

    const user = await User.findByIdAndDelete(req.params.id).lean();
    
    if (!user) {
      throw createError('User not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: { user: { id: user._id } }
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}
