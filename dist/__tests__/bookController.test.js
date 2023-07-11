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
let bookTestId = "7badd37e-b59a-4024-9406-cd875e6932d6";
describe('Test book API endpoints', () => {
    it('GET all books - should return 200 success', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/users/signin").send(userLoginDetails);
        token = loginResponse.body.token;
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).get('/books/getbooks').set("authorization", `Bearer ${token}`);
        expect(body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                bookId: expect.any(String),
                title: expect.any(String),
                author: expect.any(String),
                pageCount: expect.any(Number)
            })
        ]));
        expect(statusCode).toBe(200);
    }));
    it('GET single book - FAIL - should fail for invalid bookId', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/users/signin").send(userLoginDetails);
        token = loginResponse.body.token;
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).get(`/books/getbook/23456687354435636`).set("authorization", `Bearer ${token}`);
        expect(body).toEqual({
            error: true,
            message: "book not found"
        });
        expect(statusCode).toBe(404);
    }));
    it('GET single book - SUCCESS - should pas for valid bookId', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/users/signin").send(userLoginDetails);
        token = loginResponse.body.token;
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).get(`/books/getbook/${bookTestId}`).set("authorization", `Bearer ${token}`);
        console.log(body.data);
        expect(body).toMatchObject({
            status: "success",
            method: "GET",
        });
        expect(statusCode).toBe(200);
    }));
    it('POST add book - FAIL - should fail for invalid or incomplete data fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/users/signin").send(userLoginDetails);
        token = loginResponse.body.token;
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post(`/books/addbook`).send({
            datePublished: "2020-0-12T19:0455.455z",
            description: "a sunny day , a cloudy night",
            pageCount: 850,
            genre: "autobiography",
            bookId: 1,
            Publisher: "josh publishers"
        })
            .set("authorization", `Bearer ${token}`);
        expect(body.ERROR.length).toBeGreaterThan(0);
        expect(statusCode).toBe(400);
    }));
    it('POST add book - FAIL - should fail if book already exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/users/signin").send(userLoginDetails);
        token = loginResponse.body.token;
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post(`/books/addbook`).send({
            title: "A Promised Land",
            author: "Barack Obama",
            datePublished: "2020-0-12T19:0455.455z",
            description: "A Promised Land is a memoir by Barack Obama, the 44th President of the United States from 2009 to 2017. Published on November 17, 2020, it is the first of a planned two-volume series",
            pageCount: 768,
            genre: "autobiography",
            Publisher: "Crown",
        })
            .set("authorization", `Bearer ${token}`);
        expect(body).toEqual({
            status: "error",
            method: "POST",
            message: "book already exist in database"
        });
        expect(statusCode).toBe(400);
    }));
    it('POST add book - SUCCESS - should add book to database', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginResponse = yield (0, supertest_1.default)(app_1.default).post("/users/signin").send(userLoginDetails);
        token = loginResponse.body.token;
        const { body, statusCode } = yield (0, supertest_1.default)(app_1.default).post(`/books/addbook`).send({
            title: "Forex Handbook",
            author: "MKO abiola",
            datePublished: "2020-0-12T19:0455.455z",
            description: "Barons overun the waste lands is the first of a planned two-volume series",
            pageCount: 900,
            genre: "Financial education",
            Publisher: "martins publishers"
        })
            .set("authorization", `Bearer ${token}`);
        expect(body).toEqual({
            status: "success",
            method: "POST",
            message: "book added succeefully",
            newBook: expect.objectContaining({
                title: expect.any(String),
                author: expect.any(String),
                datePublished: expect.any(String),
                description: expect.any(String),
                pageCount: expect.any(Number),
                genre: expect.any(String),
                bookId: expect.any(String),
                Publisher: expect.any(String),
                craetedAt: expect.any(String),
                updatedAt: expect.any(String)
            })
        });
        expect(statusCode).toBe(200);
        const allBooks = (0, helpers_1.readData)('./src/booksDatabase/booksDatabase.json');
        allBooks.pop();
        (0, helpers_1.saveData)('./src/booksDatabase/booksDatabase.json', allBooks);
    }));
    // it.skip("PUT update book - FAIL - should fail if book title doesn't exist", async () => {
    //   const loginResponse = await request(app).post("/users/signin").send(userLoginDetails);
    //   token = loginResponse.body.token;
    //   const {body, statusCode} = await request(app).post(`/books/update`).send({
    //     title: "Tales of Alkebuland",
    //     author: "Nkunku Nashundi",
    //     datePublished: "2020-0-12T19:0455.455z",
    //     description: "A Promised Land is a memoir by Barack Obama, the 44th President of the United States from 2009 to 2017",
    //     pageCount: 768,
    //     genre: "autobiography",
    //     Publisher: "Crown",
    //   })
    //   .set("authorization", `Bearer ${token}`);
    //   expect(body).toEqual({
    //     status:"error",
    //     method: "POST",
    //     message: "book already exist in database"
    //   })
    //   expect(statusCode).toBe(400)
    // });
});
// const {body, statusCode} = await request(app).post(`/books/addbook`).send({
//   title: "The Jouney",
//   author: "nnaji jenifer",
//   datePublished: "2020-0-12T19:0455.455z",
//   description:  "a sunny day , a cloudy night",
//   pageCount: 850,
//   genre: "autobiography",
//   bookId: 1,
//   Publisher: "josh publishers"
// }).set("authorization", `Bearer ${token}`);
