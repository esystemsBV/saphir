export interface response {
  success: boolean;
  error?: string;
}

export type paimentsTypes =
  | "cash"
  | "tpe"
  | "cheque"
  | "effect"
  | "virement"
  | "others";

export interface families {
  reference?: number;
  name: string;
  image: string | null;
}

export interface products {
  reference: number;
  familyId: string;
  quantity?: number;
  image: string | null;
  familyName?: string;
  name: string;
  stock?: number;
  newstock?: number;
  boughtPrice: number;
  sellPrice: number;
}

export interface packs {
  reference: number;
  image: string | null;
  quantity?: number;
  name: string;
  price: number;
  productsReferences: string[];
}

export interface StockMovement {
  type: "up" | "down";
  source: "pos" | "bondeliv" | "stockadd" | "initial";
  quantity: number;
  date: string;
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
  fullname: string;
  phone: string;
  company_rc?: number;
  company_if?: number;
  company_tp?: string;
  company_ice?: string;
  type: "company" | "personal";
}

export interface fournisseurs {
  reference: number;
  address?: string;
  fullname: string;
  phone: string;
  company_rc?: number;
  company_if?: number;
  company_tp?: string;
  company_ice?: string;
  type: "company" | "personal";
}

export interface companyPapers {
  company_rc?: number;
  company_if?: number;
  company_tp?: string;
  company_ice?: string;
}

export interface delivery_notes {
  reference: number;
  delivery_date: string;
  short_delivery_date: string;
  created_date: string;
  client: clients;
  products: products[];
  total_price: number;
  status: "in_progress" | "completed";
  type: "pos" | "client" | "order";
}

export interface retour_client_notes {
  reference: number;
  delivery_date: string;
  short_delivery_date: string;
  created_date: string;
  client: clients;
  products: products[];
  total_price: number;
  status: "in_progress" | "completed";
  type: "pos" | "client" | "order";
}

export interface delivery_notes_by_id {
  reference: number;
  delivery_date: string;
  short_delivery_date: string;
  created_date: string;
  client_fullname: string;
  remise: number;
  client_phone: string;
  products: products[];
  packs: packs[];
  total_price: number;
  status: "in_progress" | "completed";
  type: "pos" | "client" | "order";
}

export interface users {
  reference: number;
  password: string;
  fname: string;
  lname: string;
  phone: string;
  email: string;
  role: "admin" | "preparator" | "delivery" | "technicocommercial" | "cashier";
  banned?: boolean;
}

export interface agencies {
  reference: number;
  location: string;
  name: string;
  phone: string;
  responsible: string;
}

export interface order {
  products?: products[];
  reference?: number;
  fullname: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city: string;
  agence: null | number;
  livreur: null | number;
  preparateur: null | number;
  ncolis: number;
  notes: null | string;
  payment_method: paimentsTypes;
  is_company: boolean;
  order_date: string;
  order_time: string;
  ice: string | null;
  siegesocial: string | null;
  createdAt?: string;
  raisonsocial: string | null;
  statut?:
    | "new"
    | "prepared"
    | "collected"
    | "shipping"
    | "delivered"
    | "payed";
}
