"use strict";
// import { Request, Response, NextFunction } from 'express';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBooks = exports.updateBooks = exports.getBook = exports.getAllBooks = exports.addBook = void 0;
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const validation_1 = require("../utilities/validation");
const helpers_1 = require("../utilities/helpers");
let booksDatabaseDirectory = path_1.default.join(__dirname, '../../src/booksDatabase');
let booksDatabaseFile = path_1.default.join(booksDatabaseDirectory, 'booksDatabase.json');
//==========================ADD BOOKS=============================
const addBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //CREATE DATABASE DYNAMICALLY
        (0, helpers_1.createDatabase)(booksDatabaseDirectory, booksDatabaseFile);
        //READ DATABASE
        let allBooks = (0, helpers_1.readData)(booksDatabaseFile);
        //CATCH DATA FROM FRONTEND
        const bodyData = req.body;
        const error = validation_1.bookSchema.safeParse(bodyData);
        if (error.success === false) {
            return res.status(400).send({
                status: "error",
                method: req.method,
                ERROR: error.error.issues.map((a) => a.message)
            });
        }
        //CHECK IF BOOK EXIST
        const existBook = allBooks.find((book) => book.title === bodyData.title);
        if (existBook) {
            return res.status(400).send({
                status: "error",
                method: req.method,
                message: "book already exist in database"
            });
        }
        //CREATE NEW BOOK
        let newBook = Object.assign(Object.assign({}, bodyData), { bookId: (0, uuid_1.v4)(), craetedAt: new Date(), updatedAt: new Date() });
        allBooks.push(newBook);
        // //WRITE TO DATABASE
        const saved = (0, helpers_1.saveData)(booksDatabaseFile, allBooks);
        return res.status(200).json({
            status: "success",
            method: req.method,
            message: "book added succeefully",
            newBook
        });
    }
    catch (error) {
    }
});
exports.addBook = addBook;
//============================GET ALL BOOKS===============================
const getAllBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //READ DATABASE
    let allBooks = (0, helpers_1.readData)(booksDatabaseFile);
    res.json(allBooks);
});
exports.getAllBooks = getAllBooks;
//===================================GET BOOK BY ID================================
const getBook = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //READ DATABASE
    let allBooks = (0, helpers_1.readData)(booksDatabaseFile);
    //GET ID FROM URL
    const bookId = req.params.id;
    const findBook = allBooks.find((book) => book.bookId == bookId);
    if (!findBook) {
        return res.status(404).json({
            error: true,
            message: "book not found"
        });
    }
    return res.status(200).json({
        status: "success",
        method: req.method,
        data: findBook
    });
});
exports.getBook = getBook;
//================================UPDATE BOOKS==================================
const updateBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //READ DATABASE
    let allBooks = (0, helpers_1.readData)(booksDatabaseFile);
    //CATCH FRONT END DATA
    const bodyData = req.body;
    //VALIDATE FRONT END DATA
    const error = validation_1.bookUpdateSchema.safeParse(bodyData);
    if (error.success === false) {
        return res.status(400).send({
            status: "error",
            method: req.method,
            ERROR: error.error.issues.map((a) => a.message)
        });
    }
    let newUpdate = Object.assign(Object.assign({}, bodyData), { updatedAt: new Date() });
    let putIndex = 0;
    let thisbook = {};
    //GET BOOK BY ID
    allBooks.map((book, i) => {
        if (book.bookId === bodyData.bookId) {
            thisbook = book;
            putIndex = i;
        }
    });
    if (!thisbook) {
        return res.status(404).json({
            status: "erro",
            method: req.method,
            message: "book not found"
        });
    }
    allBooks.splice(putIndex, 1, newUpdate);
    //WRITE TO FILE
    (0, helpers_1.saveData)(booksDatabaseFile, allBooks);
    return res.status(200).json({
        status: "success",
        method: req.method,
        message: "book updated succeefully",
        newUpdate
    });
});
exports.updateBooks = updateBooks;
//================================DELETE BOOKS==================================
const deleteBooks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //READ DATABASE
    let allBooks = (0, helpers_1.readData)(booksDatabaseFile);
    //CATCH FRONT END DATA
    const bodyData = req.body;
    let putIndex = 0;
    let thisbook = {};
    allBooks.map((book, i) => {
        if (book.bookId === bodyData.bookId) {
            thisbook = book;
            putIndex = i;
        }
    });
    if (!thisbook) {
        return res.status(404).json({
            error: true,
            message: "book not found"
        });
    }
    let deleted = allBooks.splice(putIndex, 1);
    //WRITE TO FILE
    (0, helpers_1.saveData)(booksDatabaseFile, allBooks);
    return res.status(200).json({
        status: "success",
        method: req.method,
        message: "book deleted succeefully",
        deleted
    });
});
exports.deleteBooks = deleteBooks;
