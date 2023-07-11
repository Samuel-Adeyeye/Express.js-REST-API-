// import { Request, Response, NextFunction } from 'express';

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 } from 'uuid';
import { bookSchema, bookUpdateSchema } from '../utilities/validation';
import { createDatabase, readData, saveData } from '../utilities/helpers';

interface Book {
    title: string;
    author: string;
    datePublished: string;
    description: string;
    pageCount: number;
    genre: string;
    bookId: number;
    Publisher: string;
    createdAt: any;
}


let booksDatabaseDirectory = path.join(__dirname, '../../src/booksDatabase');
let booksDatabaseFile = path.join(booksDatabaseDirectory, 'booksDatabase.json');



//==========================ADD BOOKS=============================

export const addBook = async (req: Request, res: Response, next: NextFunction) => {

    try {
        //CREATE DATABASE DYNAMICALLY
        createDatabase(booksDatabaseDirectory, booksDatabaseFile);
        //READ DATABASE
        let allBooks = readData(booksDatabaseFile);
        //CATCH DATA FROM FRONTEND
        const bodyData = req.body;
        const error = bookSchema.safeParse(bodyData);
        if (error.success === false) {
            return res.status(400).send({
                status: "error",
                method: req.method,
                ERROR: error.error.issues.map((a: any) => a.message)
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
        let newBook: Book = {
            ...bodyData,
            bookId: v4(),
            craetedAt: new Date(),
            updatedAt: new Date()
        };
        allBooks.push(newBook);

        // //WRITE TO DATABASE
        const saved = saveData(booksDatabaseFile, allBooks);
        return res.status(200).json({
            status: "success",
            method: req.method,
            message: "book added succeefully",
            newBook
        });

    } catch (error) {

    }
};



//============================GET ALL BOOKS===============================
export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
    //READ DATABASE
    let allBooks = readData(booksDatabaseFile);
    res.json(allBooks);

};




//===================================GET BOOK BY ID================================
export const getBook = async (req: Request, res: Response, next: NextFunction) => {

    //READ DATABASE
    let allBooks = readData(booksDatabaseFile);
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

};


//================================UPDATE BOOKS==================================
export const updateBooks = async (req: Request, res: Response, next: NextFunction) => {

    //READ DATABASE
    let allBooks = readData(booksDatabaseFile);

    //CATCH FRONT END DATA
    const bodyData = req.body;

    //VALIDATE FRONT END DATA
    const error = bookUpdateSchema.safeParse(bodyData);
    if (error.success === false) {
        return res.status(400).send({
            status: "error",
            method: req.method,
            ERROR: error.error.issues.map((a: any) => a.message)
        });
    }


    let newUpdate = {
        ...bodyData,
        updatedAt: new Date()
    };
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
    saveData(booksDatabaseFile, allBooks);
    return res.status(200).json({
        status: "success",
        method: req.method,
        message: "book updated succeefully",
        newUpdate
    });


};


//================================DELETE BOOKS==================================
export const deleteBooks = async (req: Request, res: Response, next: NextFunction) => {

    //READ DATABASE
    let allBooks = readData(booksDatabaseFile);



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

    let deleted = allBooks.splice(putIndex, 1,);

    //WRITE TO FILE
    saveData(booksDatabaseFile, allBooks);
    return res.status(200).json({
        status: "success",
        method: req.method,
        message: "book deleted succeefully",
        deleted
    });


};