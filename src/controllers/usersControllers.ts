import express, { Request, Response, NextFunction } from 'express';
import { readData, createDatabase, saveData } from '../utilities/helpers';
import path from 'path';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import jwt from "jsonwebtoken";
import { userSchema } from '../utilities/validation';


interface user {
    name: string;
    username: string;
    email: string;
    password: string;
    id: any;
    createdAt: any;
}


let userDatabaseDirectory = path.join(__dirname, '../../src/userDatabase');
let userDatabaseFile = path.join(userDatabaseDirectory, 'userDatabase.json');


export const addUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        //CREATE DATABASE DYNAMICALLY
        createDatabase(userDatabaseDirectory, userDatabaseFile);

        //READ DATABASE
        const allUsers: any = readData(userDatabaseFile);

        //CATCH FRONT END DATA
        const bodyData = req.body;

        //VALIDATE DATA
        const error = userSchema.safeParse(bodyData);

        if (error.success === false) {
            return res.status(400).send({
                status: "error",
                method: req.method,
                ERROR: error.error.issues.map((a: any) => a.message)
            });
        }

        //CHECK IF USER EXIST
        const exitingEmail = allUsers.find((user: user) => user.email === bodyData.email);
        const exitingUserName = allUsers.find((user: user) => user.username === bodyData.username);

        if (exitingEmail) {
            return res.status(400).json({
                status: "error",
                method: req.method,
                message: "user already exist"
            });
        }

        if (exitingUserName) {
            return res.status(400).json({
                status: "error",
                method: req.method,
                message: "username already exist"
            });
        }


        //ENCRYPT PASSWORD
        const saltRound = 12;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(bodyData.password, salt);


        // CREATE USER
        const newUser: user = {
            ...bodyData,
            password: hash,
            id: v4(),
            createdAt: new Date()
        };

        allUsers.push(newUser);


        //WRITE TO FILE
        const isaved = saveData(userDatabaseFile, allUsers);
        if (!isaved) {
            return res.status(400).send({
                ERROR: "could not save data"
            });
        } else {
            return res.status(200).json({
                status: "success",
                method: req.method,
                message: "user created successfuly",
                newUser
            });
        }

    } catch (error) {

    }
};



export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //READ DATABASE
        const allUsers: any = readData(userDatabaseFile);

        //CATCH FRONT END DATA
        const { email, password } = req.body;

        //VALIDATE USER EMAIL
        const thisUser = allUsers.find((user: user) => user.email === email);
        const app_secret = process.env.SECRET;

        if (thisUser) {
            //VALIDATE USER PASSWORD
            const validated = await bcrypt.compare(password, thisUser.password);

            if (validated) {
                const token = jwt.sign(thisUser, `${app_secret}`);
                return res.status(200).json({
                    status: "success",
                    method: req.method,
                    message: "Login Successful",
                    email: thisUser.email,
                    token
                });
            } else {
                return res.status(401).send({
                    status: "error",
                    method: req.method,
                    message: "email or password is incorrect"
                });
            }

        } else {
            return res.status(404).json({
                status: "error",
                method: req.method,
                message: "user not found"
            });
        }

    } catch (error) {

    }
};



export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {

    try {
        //READ DATABASE
        const allUsers: any = readData(userDatabaseFile);

        const Id = req.params.id;
        let deletedUser = {};
        let deleteIndex = 0;

        allUsers.map((user: user, i: number) => {
            if (user.id === Id) {
                deletedUser = user;
                deleteIndex = i;
            }
        });

        if (!deletedUser) {
            return res.status(404).send({
                ERROR: "user not found"
            });
        }

        allUsers.splice(deleteIndex, 1);

        //WRITE TO FILE
        const isaved = saveData(userDatabaseFile, allUsers);

        if (!isaved) {
            return res.status(400).send({
                ERROR: "could not save data"
            });
        } else {
            return res.status(200).json({
                status: "success",
                method: req.method,
                message: "user deleted successfuly",
                deletedUser
            });
        }



    } catch (error) {



    }

}





