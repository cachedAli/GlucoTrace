import { Request, Response } from "express";

export type Req<T = any> = Request<{}, {}, T>;
export type Res<T = any> = Response<T>;

export type Email= string;