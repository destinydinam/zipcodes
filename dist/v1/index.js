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
const cors_1 = __importDefault(require("cors"));
const cities_with_states_1 = require("../models/cities_with_states");
const allZipInfo_1 = require("../models/allZipInfo");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/v1/get_states", (_, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(200).json(states_1.usStates); }));
const base_url = "https://us-zipcodes.onrender.com";
app.get("/v1/get_all_cities", (_, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(200).json(cities_1.cities); }));
app.get("/v1/get_cites", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req_url = new URL(base_url + req.url);
    if (!req_url.search)
        return res.status(400).json({ message: "No Keyword Provided" });
    const params = [];
    req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
    const keyword = params[0].keyword;
    // console.log("app.get ~ keyword:", keyword);
    if (keyword && keyword.length > 2) {
        const new_cities = cities_1.cities.filter((c) => c
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(keyword.toLowerCase().replace(/\s+/g, "")));
        // console.log("app.get ~ new_cities:", new_cities.length);
        return res.status(200).json(new_cities);
    }
    else
        return res.status(400).json({
            message: "Invalid Keyword, Keyword must be more than 2 characters",
        });
}));
app.get("/v1/get_cites_by_state", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req_url = new URL(base_url + req.url);
    if (!req_url.search)
        return res.status(400).json({ message: "No State Provided" });
    const params = [];
    req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
    const state = params[0].state;
    if (state && state !== "state") {
        const new_cities = cities_with_states_1.cities_with_states
            .filter((c) => c.state === state)
            .map((c) => c.city);
        return res.status(200).json(new_cities);
    }
    else
        return res.status(400).json({ message: "Invalid State" });
}));
app.get("/v1/get_states_by_city", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req_url = new URL(base_url + req.url);
    if (!req_url.search)
        return res.status(400).json({ message: "No City Provided" });
    const params = [];
    req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
    const city = params[0].city;
    if (city && city !== "city") {
        const new_cities = cities_with_states_1.cities_with_states
            .filter((c) => c.city === city)
            .map((c) => c.state);
        // .map((c) => {
        //   const state = usStatesObj[c.state];
        //   return { name: state?.name, id: state?.abbr };
        // });
        return res.status(200).json(new_cities);
    }
    else
        return res.status(400).json({ message: "Invalid City" });
}));
app.get("/v1/get_zipcodes_by_city", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req_url = new URL(base_url + req.url);
    if (!req_url.search)
        return res.status(400).json({ message: "No City Provided" });
    const params = [];
    req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
    const city = params[0].city;
    if (city && city !== "city") {
        const zipcodes = [];
        for (let i = 0; i < allZipInfo_1.all_zipcodes.length; i++) {
            const zip = allZipInfo_1.all_zipcodes[i];
            if (zip.city === city)
                zipcodes.push(zip.zip);
        }
        return res.status(200).json(zipcodes);
    }
    else
        return res.status(400).json({ message: "Invalid City" });
}));
app.get("/v1/verify_city_state_zip", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const req_url = new URL(base_url + req.url);
    if (!req_url.search)
        return res.status(400).json({ message: "No Details Provided" });
    const params = {};
    req_url.searchParams.forEach((val, key) => (params[key] = val));
    const { city, state, zip } = params;
    if (city && state && zip) {
        return res.status(200).json({
            status: !!allZipInfo_1.all_zipcodes.find((i) => i.city === city && i.state === state && i.zip === zip),
        });
    }
    else
        return res.status(400).json({ message: "Invalid Details" });
}));
// {{base_url}}/v1/get_zipcodeinfo?zipcode=00903
app.get("/v1/get_zipcodeinfo", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const req_url = new URL(base_url + req.url);
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
// https://raw.githubusercontent.com/davglass/zipcodes/master/lib/codes.js
// https://github.com/search?q=zip%20codes%20us%20with%20cities&type=repositories
//# sourceMappingURL=index.js.map