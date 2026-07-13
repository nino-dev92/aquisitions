import {
  deleteUserProfile,
  getUser,
  getUsers,
  updateUserProfile,
} from '#controllers/users.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUserProfile);
router.delete('/:id', deleteUserProfile);

export default router;
