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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const helpers_1 = require("../utilities/helpers");
let token = "";
const userLoginDetails = {
    email: "jayjay@mail.com",
    password: "123456"
};
describe('Test user API endpoints', () => {
    it('POST create user - FAIL - should fail for invalid or incomplete fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post('/users/signup').send({
            username: "goku",
            email: "sungoku",
            password: "123456"
        });
        expect(body.ERROR.length).toBeGreaterThan(0);
        expect(statusCode).toBe(400);
    }));
    it('POST create user - FAIL - should fail if email already exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post('/users/signup').send({
            name: "jamialla",
            username: "Jamal",
            email: "jayjay@mail.com",
            password: "123456"
        });
        expect(body).toEqual({
            status: "error",
            method: "POST",
            message: "user already exist"
        });
        expect(statusCode).toBe(400);
    }));
    it('POST create user - FAIL - should fail if username already exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post('/users/signup').send({
            name: "jamialla",
            username: "Jamal",
            email: "jamal223@mail.com",
            password: "123456"
        });
        expect(body).toEqual({
            status: "error",
            method: "POST",
            message: "username already exist"
        });
        expect(statusCode).toBe(400);
    }));
    it('POST create user - SUCCESS - should succeed if all info supplied correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post('/users/signup').send({
            name: "goku jinchuriki",
            username: "hachibi",
            email: "songoku@mail.com",
            password: "123456"
        });
        expect(body).toEqual({
            status: "success",
            method: "POST",
            message: "user created successfuly",
            newUser: expect.objectContaining({
                name: expect.any(String),
                username: expect.any(String),
                email: expect.any(String),
                password: expect.any(String),
                id: expect.any(String),
                createdAt: expect.any(String)
            })
        });
        expect(statusCode).toBe(200);
        const allUsers = (0, helpers_1.readData)('./src/userDatabase/userDatabase.json');
        allUsers.pop();
        (0, helpers_1.saveData)('./src/userDatabase/userDatabase.json', allUsers);
    }));
    it('POST login user - FAIL - should fail if user does not exist ', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post('/users/signin').send({
            email: "huyga@mail.com",
            password: "123456"
        });
        expect(body).toEqual({
            status: "error",
            method: "POST",
            message: "user not found"
        });
        expect(statusCode).toBe(404);
    }));
    it('POST login user - FAIL - should fail if email or password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post('/users/signin').send({
            email: "jayjay@mail.com",
            password: "675534"
        });
        expect(body).toEqual({
            status: "error",
            method: "POST",
            message: "email or password is incorrect"
        });
        expect(statusCode).toBe(401);
    }));
    it('POST login user - SUCCESS - should pass if email & password is correct', () => __awaiter(void 0, void 0, void 0, function* () {
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post('/users/signin').send(userLoginDetails);
        token = body.token;
        expect(body).toMatchObject({
            status: "success",
            method: "POST",
            message: "Login Successful",
            email: userLoginDetails.email,
        });
        expect(token.length).toBeGreaterThan(0);
        expect(statusCode).toBe(200);
    }));
});
