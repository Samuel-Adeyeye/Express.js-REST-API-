"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveData = exports.readData = exports.createDatabase = void 0;
const fs_1 = __importDefault(require("fs"));
const createDatabase = (databaseFolder, databaseFile) => {
    if (!fs_1.default.existsSync(databaseFolder)) {
        fs_1.default.mkdirSync(databaseFolder);
    }
    if (!fs_1.default.existsSync(databaseFile)) {
        fs_1.default.writeFileSync(databaseFile, " ");
    }
};
exports.createDatabase = createDatabase;
const readData = (filePath) => {
    let allCollection = [];
    try {
        let data = fs_1.default.readFileSync(filePath, "utf-8");
        allCollection = JSON.parse(data);
    }
    catch (parseError) {
        allCollection = [];
    }
    return allCollection;
};
exports.readData = readData;
const saveData = (filePath, data) => {
    try {
        fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.saveData = saveData;
