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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
// {{base_url}}/v1/get_zipcodeinfo?zipcode=00903
app.get("/v1/get_zipcodeinfo", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const req_url = req.rawHeaders;
        console.log("req_url:", req_url[1]);
        console.log("req.url:", req.url);
        // const url = new URL(req.url);
        // console.log("url:", url);
        res.send("Hello World");
    });
});
app.listen(process.env.PORT || 42069, () => {
    console.log("Server started");
});
//# sourceMappingURL=index.js.map