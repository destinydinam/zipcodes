import express, { Request, Response } from "express";
import { codes1 } from "../models/codes1";
import { codes2 } from "../models/codes2";
import { codes3 } from "../models/codes3";
import { codes4 } from "../models/codes4";
import { codes5 } from "../models/codes5";
import { usStates, usStatesObj } from "../models/states";
import { cities } from "../models/cities";
import cors from "cors";
import { cities_with_states } from "../models/cities_with_states";
import { all_zipcodes } from "../models/allZipInfo";
const app = express();

app.use(cors());

app.get("/v1/get_states", async (_, res: Response) =>
  res.status(200).json(usStates)
);

const base_url = "https://us-zipcodes.onrender.com";

app.get("/v1/get_all_cities", async (_, res: Response) =>
  res.status(200).json(cities)
);

app.get("/v1/get_cites", async (req: Request, res: Response) => {
  const req_url = new URL(base_url + req.url);

  if (!req_url.search)
    return res.status(400).json({ message: "No Keyword Provided" });

  const params: { [x: string]: string }[] = [];
  req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
  const keyword = params[0].keyword;
  // console.log("app.get ~ keyword:", keyword);

  if (keyword && keyword.length > 2) {
    const new_cities = cities.filter((c) =>
      c
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(keyword.toLowerCase().replace(/\s+/g, ""))
    );

    // console.log("app.get ~ new_cities:", new_cities.length);

    return res.status(200).json(new_cities);
  } else
    return res.status(400).json({
      message: "Invalid Keyword, Keyword must be more than 2 characters",
    });
});

app.get("/v1/get_cites_by_state", async (req: Request, res: Response) => {
  const req_url = new URL(base_url + req.url);

  if (!req_url.search)
    return res.status(400).json({ message: "No State Provided" });

  const params: { [x: string]: string }[] = [];
  req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
  const state = params[0].state;

  if (state && state !== "state") {
    const new_cities = cities_with_states
      .filter((c) => c.state === state)
      .map((c) => c.city);

    return res.status(200).json(new_cities);
  } else return res.status(400).json({ message: "Invalid State" });
});

app.get("/v1/get_states_by_city", async (req: Request, res: Response) => {
  const req_url = new URL(base_url + req.url);

  if (!req_url.search)
    return res.status(400).json({ message: "No City Provided" });

  const params: { [x: string]: string }[] = [];
  req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
  const city = params[0].city;

  if (city && city !== "city") {
    const new_cities = cities_with_states
      .filter((c) => c.city === city)
      .map((c) => c.state);
    // .map((c) => {
    //   const state = usStatesObj[c.state];
    //   return { name: state?.name, id: state?.abbr };
    // });

    return res.status(200).json(new_cities);
  } else return res.status(400).json({ message: "Invalid City" });
});

app.get("/v1/get_zipcodes_by_city", async (req: Request, res: Response) => {
  const req_url = new URL(base_url + req.url);

  if (!req_url.search)
    return res.status(400).json({ message: "No City Provided" });

  const params: { [x: string]: string }[] = [];
  req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
  const city = params[0].city;

  if (city && city !== "city") {
    const zipcodes = [];

    for (let i = 0; i < all_zipcodes.length; i++) {
      const zip = all_zipcodes[i];
      if (zip.city === city) zipcodes.push(zip.zip);
    }

    return res.status(200).json(zipcodes);
  } else return res.status(400).json({ message: "Invalid City" });
});

// {{base_url}}/v1/get_zipcodeinfo?zipcode=00903

app.get("/v1/get_zipcodeinfo", async function (req: Request, res: Response) {
  const req_url = new URL(base_url + req.url);

  if (!req_url.search)
    return res.status(400).json({ message: "Invalid Zipcode" });

  const params: { [x: string]: string }[] = [];
  req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
  const zipcode = params[0].zipcode;

  console.time();
  if (zipcode) {
    let zip_info: {
      zip: string;
      city: string;
      state: string;
    };

    zip_info = codes1[zipcode];
    if (zip_info) {
      console.timeEnd();
      return res.status(200).json(zip_info);
    }

    zip_info = codes2[zipcode];
    if (zip_info) {
      console.timeEnd();
      return res.status(200).json(zip_info);
    }

    zip_info = codes3[zipcode];
    if (zip_info) {
      console.timeEnd();
      return res.status(200).json(zip_info);
    }
    zip_info = codes4[zipcode];
    if (zip_info) {
      console.timeEnd();
      return res.status(200).json(zip_info);
    }
    zip_info = codes5[zipcode];
    if (zip_info) {
      console.timeEnd();
      return res.status(200).json(zip_info);
    }

    console.timeEnd();
    return res.status(400).json({ message: "Invalid Zipcode" });
  } else {
    console.timeEnd();
    return res.status(400).json({ message: "Invalid Zipcode" });
  }
});

app.listen(process.env.PORT || 42069, () => console.log("Server started"));
// https://raw.githubusercontent.com/davglass/zipcodes/master/lib/codes.js
// https://github.com/search?q=zip%20codes%20us%20with%20cities&type=repositories
