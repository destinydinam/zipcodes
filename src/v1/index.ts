import express, { Request, Response } from "express";
import { codes1 } from "../models/codes1";
import { codes2 } from "../models/codes2";
import { codes3 } from "../models/codes3";
import { codes4 } from "../models/codes4";
import { codes5 } from "../models/codes5";
import { usStates } from "../models/states";
import { cities } from "../models/cities";

const app = express();

app.get("/v1/get_states", async (_, res: Response) =>
  res.status(200).json(usStates)
);

const base_url = "https://us-zipcodes.onrender.com";

app.get("/v1/get_cites", async (req: Request, res: Response) => {
  const req_url = new URL(base_url + req.url);

  if (!req_url.search)
    return res.status(400).json({ message: "No Keyword Provided" });

  const params: { [x: string]: string }[] = [];
  req_url.searchParams.forEach((val, key) => params.push({ [key]: val }));
  const keyword = params[0].keyword;

  if (keyword && keyword.length > 2) {
    const new_cities = cities.filter((c) =>
      c.toLowerCase().includes(keyword.toLowerCase())
    );

    return res.status(200).json(new_cities);
  } else
    return res.status(400).json({
      message: "Invalid Keyword, Keyword must be more than 2 characters",
    });
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
