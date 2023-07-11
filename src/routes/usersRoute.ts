import express, { Request, Response, NextFunction } from 'express';
import { addUser, signIn, deleteUser } from '../controllers/usersControllers';
const router = express.Router();

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource');
});


//USER ROUTE
router.post('/signup', addUser);
router.post('/signin', signIn);
router.delete('/delete/:id', deleteUser);

export default router;
