import { body, param, query } from 'express-validator';

export const validateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('age')
    .isInt({ min: 0, max: 120 })
    .withMessage('Age must be a number between 0 and 120'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('Role must be admin, user, or moderator'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

export const validateUpdateUser = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('age')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('Age must be a number between 0 and 120'),
  
  body('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('Role must be admin, user, or moderator'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

export const validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID')
];

export const validateUserQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('role')
    .optional()
    .isIn(['admin', 'user', 'moderator'])
    .withMessage('Role must be admin, user, or moderator'),
  
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Search term must not be empty')
];
