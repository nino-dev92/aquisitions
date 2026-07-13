import logger from '#config/logger.js';
import { formatValidationError } from '#utils/format.js';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '#services/users.service.js';
import {
  updateUserSchema,
  userIdSchema,
} from '#validations/users.validation.js';

export const getUsers = async (req, res, next) => {
  try {
    logger.info('Getting users....');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validationResult = userIdSchema.safeParse({ id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    logger.info(`Getting user with id ${validationResult.data.id}`);
    const user = await getUserById(validationResult.data.id);

    res.json({
      message: 'Successfully retrieved user',
      user,
    });
  } catch (error) {
    logger.error(`Error getting user: ${error.message}`);

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validationResult = userIdSchema.safeParse({ id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const updatesValidation = updateUserSchema.safeParse(req.body);

    if (!updatesValidation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(updatesValidation.error),
      });
    }

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    const targetUserId = validationResult.data.id;
    const updates = updatesValidation.data;

    if (currentUserId !== targetUserId && currentUserRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (
      currentUserId !== targetUserId &&
      updates.role &&
      currentUserRole !== 'admin'
    ) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (
      currentUserId !== targetUserId &&
      updates.role &&
      currentUserRole === 'admin'
    ) {
      logger.info(
        `Admin ${currentUserId} updated role for user ${targetUserId}`
      );
    }

    logger.info(`Updating user ${targetUserId}`);
    const updatedUser = await updateUser(targetUserId, updates);

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    next(error);
  }
};

export const deleteUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const validationResult = userIdSchema.safeParse({ id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;
    const targetUserId = validationResult.data.id;

    if (currentUserId !== targetUserId && currentUserRole !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    logger.info(`Deleting user ${targetUserId}`);
    const deletedUser = await deleteUser(targetUserId);

    res.json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    next(error);
  }
};
