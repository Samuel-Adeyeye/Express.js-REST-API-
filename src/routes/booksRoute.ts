import express, { Request, Response, NextFunction } from "express";
import { addBook, getAllBooks, getBook, updateBooks, deleteBooks } from '../controllers/booksControllers';
import { authenticate } from "../utilities/auth";

const router = express.Router();



router.post('/addbook', authenticate, addBook);
router.get('/getbooks', authenticate, getAllBooks);
router.get('/getbook/:id', authenticate, getBook);
router.put('/update', authenticate, updateBooks);
router.delete('/delete/:id', authenticate, deleteBooks);


//authenticate,





export default router;