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
const codes1_1 = require("../models/codes1");
const codes2_1 = require("../models/codes2");
const codes3_1 = require("../models/codes3");
const codes4_1 = require("../models/codes4");
const codes5_1 = require("../models/codes5");
const states_1 = require("../models/states");
const cities_1 = require("../models/cities");
const app = (0, express_1.default)();
app.get("/v1/get_states", (_, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(200).json(states_1.usStates); }));
app.get("/v1/get_cites", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Object.values(codes1).map((codeInfo) => cities.push(codeInfo.city));
    // Object.values(codes2).map((codeInfo) => cities.push(codeInfo.city));
    // Object.values(codes3).map((codeInfo) => cities.push(codeInfo.city));
    // Object.values(codes4).map((codeInfo) => cities.push(codeInfo.city));
    // Object.values(codes5).map((codeInfo) => cities.push(codeInfo.city));
    // console.log("app.get ~ cities:", cities.length);
    // const uniqueCities: string[] = Array.from(new Set(cities));
    // console.log("app.get ~ uniqueCities:", uniqueCities.length);
    const req_url = new URL(req.rawHeaders[1] + req.url);
    console.log("app.get ~ req_url:", req_url);
    if (!req_url.search)
        return res.status(400).json({ message: "No Keyword Provided" });
    const params = [];
    req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
    const keyword = params[0].keyword;
    console.log("app.get ~ keyword:", keyword);
    if (keyword && keyword.length > 2) {
        const new_cities = cities_1.cities.filter((c) => c.toLowerCase().includes(keyword.toLowerCase()));
        console.log("app.get ~ new_cities:", new_cities.length);
        return res.status(200).json(new_cities);
    }
    else
        return res.status(400).json({
            message: "Invalid Keyword, Keyword must be more than 2 characters",
        });
}));
// {{base_url}}/v1/get_zipcodeinfo?zipcode=00903
app.get("/v1/get_zipcodeinfo", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const req_url = new URL(req.rawHeaders[1] + req.url);
        if (!req_url.search)
            return res.status(400).json({ message: "Invalid Zipcode" });
        const params = [];
        req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
        const zipcode = params[0].zipcode;
        console.time();
        if (zipcode) {
            let zip_info;
            zip_info = codes1_1.codes1[zipcode];
            if (zip_info) {
                console.timeEnd();
                return res.status(200).json(zip_info);
            }
            zip_info = codes2_1.codes2[zipcode];
            if (zip_info) {
                console.timeEnd();
                return res.status(200).json(zip_info);
            }
            zip_info = codes3_1.codes3[zipcode];
            if (zip_info) {
                console.timeEnd();
                return res.status(200).json(zip_info);
            }
            zip_info = codes4_1.codes4[zipcode];
            if (zip_info) {
                console.timeEnd();
                return res.status(200).json(zip_info);
            }
            zip_info = codes5_1.codes5[zipcode];
            if (zip_info) {
                console.timeEnd();
                return res.status(200).json(zip_info);
            }
            console.timeEnd();
            return res.status(400).json({ message: "Invalid Zipcode" });
        }
        else {
            console.timeEnd();
            return res.status(400).json({ message: "Invalid Zipcode" });
        }
    });
});
app.listen(process.env.PORT || 42069, () => console.log("Server started"));
//# sourceMappingURL=index.js.map