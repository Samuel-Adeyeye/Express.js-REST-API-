"use strict";
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
exports.deleteUser = exports.signIn = exports.addUser = void 0;
const helpers_1 = require("../utilities/helpers");
const path_1 = __importDefault(require("path"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validation_1 = require("../utilities/validation");
let userDatabaseDirectory = path_1.default.join(__dirname, '../../src/userDatabase');
let userDatabaseFile = path_1.default.join(userDatabaseDirectory, 'userDatabase.json');
const addUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //CREATE DATABASE DYNAMICALLY
        (0, helpers_1.createDatabase)(userDatabaseDirectory, userDatabaseFile);
        //READ DATABASE
        const allUsers = (0, helpers_1.readData)(userDatabaseFile);
        //CATCH FRONT END DATA
        const bodyData = req.body;
        //VALIDATE DATA
        const error = validation_1.userSchema.safeParse(bodyData);
        if (error.success === false) {
            return res.status(400).send({
                status: "error",
                method: req.method,
                ERROR: error.error.issues.map((a) => a.message)
            });
        }
        //CHECK IF USER EXIST
        const exitingEmail = allUsers.find((user) => user.email === bodyData.email);
        const exitingUserName = allUsers.find((user) => user.username === bodyData.username);
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
        const salt = yield bcrypt_1.default.genSalt(saltRound);
        const hash = yield bcrypt_1.default.hash(bodyData.password, salt);
        // CREATE USER
        const newUser = Object.assign(Object.assign({}, bodyData), { password: hash, id: (0, uuid_1.v4)(), createdAt: new Date() });
        allUsers.push(newUser);
        //WRITE TO FILE
        const isaved = (0, helpers_1.saveData)(userDatabaseFile, allUsers);
        if (!isaved) {
            return res.status(400).send({
                ERROR: "could not save data"
            });
        }
        else {
            return res.status(200).json({
                status: "success",
                method: req.method,
                message: "user created successfuly",
                newUser
            });
        }
    }
    catch (error) {
    }
});
exports.addUser = addUser;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //READ DATABASE
        const allUsers = (0, helpers_1.readData)(userDatabaseFile);
        //CATCH FRONT END DATA
        const { email, password } = req.body;
        //VALIDATE USER EMAIL
        const thisUser = allUsers.find((user) => user.email === email);
        const app_secret = process.env.SECRET;
        if (thisUser) {
            //VALIDATE USER PASSWORD
            const validated = yield bcrypt_1.default.compare(password, thisUser.password);
            if (validated) {
                const token = jsonwebtoken_1.default.sign(thisUser, `${app_secret}`);
                return res.status(200).json({
                    status: "success",
                    method: req.method,
                    message: "Login Successful",
                    email: thisUser.email,
                    token
                });
            }
            else {
                return res.status(401).send({
                    status: "error",
                    method: req.method,
                    message: "email or password is incorrect"
                });
            }
        }
        else {
            return res.status(404).json({
                status: "error",
                method: req.method,
                message: "user not found"
            });
        }
    }
    catch (error) {
    }
});
exports.signIn = signIn;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //READ DATABASE
        const allUsers = (0, helpers_1.readData)(userDatabaseFile);
        const Id = req.params.id;
        let deletedUser = {};
        let deleteIndex = 0;
        allUsers.map((user, i) => {
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
        const isaved = (0, helpers_1.saveData)(userDatabaseFile, allUsers);
        if (!isaved) {
            return res.status(400).send({
                ERROR: "could not save data"
            });
        }
        else {
            return res.status(200).json({
                status: "success",
                method: req.method,
                message: "user deleted successfuly",
                deletedUser
            });
        }
    }
    catch (error) {
    }
});
exports.deleteUser = deleteUser;
