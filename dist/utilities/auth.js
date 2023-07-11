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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authorise = req.headers.authorization;
        if (authorise === undefined) {
            return res.status(401).send({
                error: true,
                message: "no auth"
            });
        }
        const tokenArr = authorise.split(" ");
        const token = tokenArr[1];
        console.log(token);
        if (!token || token === '') {
            return res.status(401).send({
                error: true,
                method: req.method,
                message: "Access Denied"
            });
        }
        const deCodeToken = jsonwebtoken_1.default.verify(token, `${process.env.SECRET}`);
        if ("user" in req) {
            req.user = deCodeToken;
        }
        return next();
    }
    catch (err) {
        return res.status(401).send({
            status: 'error',
            method: req.method,
            message: "Authorization failed",
            error: err.message
        });
    }
});
exports.authenticate = authenticate;
