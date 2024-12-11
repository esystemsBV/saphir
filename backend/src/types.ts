import { SessionData } from "express-session";

export interface CustomSession extends SessionData {
  user?: { name: string; role: string };
}

export interface users {
  reference: string | number;
  fname: string;
  lname: string;
  phone: string;
  email: string;
  password: string;
  role: "admin" | "preparator" | "delivery" | "technicocommercial" | "cashier";
  banned?: boolean;
}

export interface families {
  reference: number;
  name: string;
}

export interface products {
  reference: number;
  familyId: string;
  image: string;
  name: string;
  boughtPrice: number;
  quantity?: number;
  sellPrice: number;
}

export interface packs {
  reference: number;
  name: string;
  price: string;
  productsReferences: string[];
}

export interface PackProductFamily {
  packReference: string | number;
  packName: string;
  packPrice: number;
  packImage: string;
  productQuantity: number;
  productReference: number | string;
  productName: string;
  productBoughtPrice: number;
  productSellPrice: number;
  familyName: string;
}

export interface clients {
  reference: number;
  address?: string;
  fname: string;
  lname: string;
  phone: string;
  company_rc?: number;
  company_if?: number;
  company_tp?: string;
  company_ice?: string;
  type: "company" | "personal";
}

export interface delivery_notes {
  reference: number;
  delivery_date: string;
  created_date: string;
  client: clients;
  products: products[];
  total_price: number;
  type: "pos" | "client" | "order";
}
