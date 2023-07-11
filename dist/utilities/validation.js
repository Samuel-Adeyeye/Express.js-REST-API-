"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookUpdateSchema = exports.bookSchema = exports.userSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSchema = zod_1.default.object({
    name: zod_1.default.string({ required_error: "name is required" }),
    username: zod_1.default.string({ required_error: "username is required" }),
    email: zod_1.default.string({ required_error: "email is required" }).email({ message: 'mail is invalid' }),
    password: zod_1.default.string({ required_error: "password is required" })
});
exports.bookSchema = zod_1.default.object({
    title: zod_1.default.string({ required_error: "title is required" }),
    author: zod_1.default.string({ required_error: "author is required" }),
    datePublished: zod_1.default.string({ required_error: "date Published is required" }),
    description: zod_1.default.string({ required_error: "description is required" }),
    pageCount: zod_1.default.number({ required_error: "page count is required" }),
    genre: zod_1.default.string({ required_error: "genre is required" }),
    Publisher: zod_1.default.string({ required_error: "publisher is required" })
});
exports.bookUpdateSchema = zod_1.default.object({
    title: zod_1.default.string({ required_error: "title is required" }),
    author: zod_1.default.string({ required_error: "author is required" }),
    datePublished: zod_1.default.string({ required_error: "date Published is required" }),
    description: zod_1.default.string({ required_error: "description is required" }),
    pageCount: zod_1.default.number({ required_error: "page count is required" }),
    genre: zod_1.default.string({ required_error: "genre is required" }),
    Publisher: zod_1.default.string({ required_error: "publisher is required" }),
    bookId: zod_1.default.string({ required_error: "bookId is required" }),
    createdAt: zod_1.default.string({ required_error: "createdAt is required" }),
    updatedAt: zod_1.default.string({ required_error: "updatedAt is required" })
});
