"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booksControllers_1 = require("../controllers/booksControllers");
const auth_1 = require("../utilities/auth");
const router = express_1.default.Router();
router.post('/addbook', auth_1.authenticate, booksControllers_1.addBook);
router.get('/getbooks', auth_1.authenticate, booksControllers_1.getAllBooks);
router.get('/getbook/:id', auth_1.authenticate, booksControllers_1.getBook);
router.put('/update', auth_1.authenticate, booksControllers_1.updateBooks);
router.delete('/delete/:id', auth_1.authenticate, booksControllers_1.deleteBooks);
//authenticate,
exports.default = router;
