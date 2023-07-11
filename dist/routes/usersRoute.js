"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersControllers_1 = require("../controllers/usersControllers");
const router = express_1.default.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
//USER ROUTE
router.post('/signup', usersControllers_1.addUser);
router.post('/signin', usersControllers_1.signIn);
router.delete('/delete/:id', usersControllers_1.deleteUser);
exports.default = router;
