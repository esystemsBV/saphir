import ViewFamily from "@/components/depot/ViewFamily";
import ViewPack from "@/components/depot/ViewPack";
import ViewProduct from "@/components/depot/ViewProduct";
import AddStock from "@/pages/AddStock";
import BonDelLiv from "@/pages/bons/BonDeLiv";
import DeliveryNoteView from "@/pages/bons/ViewBonDeLiv";
import Clients from "@/pages/clients/Clients";
import Fournisseurs from "@/pages/clients/Fournisseurs";
import Families from "@/pages/depot/GesFamilies";
import Packs from "@/pages/depot/GesPack";
import ProductsPage from "@/pages/depot/GesProductst";
import LoginPage from "@/pages/Login";
import LogOutPage from "@/pages/Logout";
import Menu from "@/pages/Menu";
import PageNotFound from "@/pages/PageNotFound";
import Settings from "@/pages/Settings";
import {
  CircleDollarSign,
  HomeIcon,
  ListOrderedIcon,
  Plus,
  ShoppingBag,
  Users,
  Settings as SettingsIcon,
  Package,
  Package2Icon,
  Home,
} from "lucide-react";

export const sidebarItems = [
  {
    label: "Accueil",
    icon: HomeIcon,
    to: "/dashboard",
  },
  {
    label: "Point de vente",
    icon: ShoppingBag,
    to: "/pos",
  },
  {
    label: "Structure",
    icon: Users,
    children: [
      { label: "Équipes", to: "/structure/teams" },
      { label: "Agences", to: "/structure/agences" },
      { label: "Clients", to: "/clients" },
      { label: "Fournisseurs", to: "/fournisseurs" },
    ],
  },
  {
    label: "Commandes",
    icon: ShoppingBag,
    children: [
      {
        label: "Vos commandes",
        to: "/orders/list",
      },
      { label: "Nouvelle com.", to: "/orders/new" },
    ],
  },
  {
    label: "Depot",
    icon: Package,
    children: [
      {
        label: "Ges. Produits",
        to: "/depot/products",
      },
      {
        label: "Ges. Familles",
        to: "/depot/families",
      },
      {
        label: "Ges. Packs",
        to: "/depot/packs",
      },
      {
        label: "Ges. Stock",
        to: "/depot/stock",
      },
    ],
  },

  {
    label: "Vente",
    icon: CircleDollarSign,
    children: [
      {
        icon: ListOrderedIcon,
        label: "Bon de livraison",
        to: "/bon/liv",
      },
      { icon: Plus, label: "Bon de retour client", to: "/bon/retourclient" },
    ],
  },

  {
    label: "Achats",
    icon: CircleDollarSign,
    children: [
      {
        icon: ListOrderedIcon,
        label: "Bon de Rec.",
        to: "/bon/rec",
      },
      { icon: Plus, label: "Bon de retour Frs.", to: "/bon/retourfrs" },
    ],
  },

  {
    label: "Paramètres",
    icon: SettingsIcon,
    to: "/settings",
  },
];

export const pages = [
  {
    name: "pointOfSale",
    path: "/",
    element: "POS",
  },
  {
    name: "families.your",
    path: "/depot/families",
    element: Families,
  },
  {
    name: "families.view",
    path: "/depot/families/*",
    element: ViewFamily,
  },
  {
    name: "products.view",
    path: "/depot/products/*",
    element: ViewProduct,
  },
  {
    name: "pack.view",
    path: "/depot/packs/*",
    element: ViewPack,
  },
  {
    name: "products.your",
    path: "/depot/products",
    element: ProductsPage,
  },
  {
    name: "packs.your",
    path: "/depot/packs",
    element: Packs,
  },
  {
    name: "clients.name",
    path: "/clients",
    element: Clients,
  },
  {
    name: "fournisseurs.name",
    path: "/fournisseurs",
    element: Fournisseurs,
  },
  {
    name: "settings",
    path: "/settings",
    element: Settings,
  },
  {
    name: "bon-liv",
    path: "/bon/liv",
    element: BonDelLiv,
  },

  {
    name: "bondeliv.view",
    path: "/bon/liv/*",
    element: DeliveryNoteView,
  },
  {
    name: "stock",
    path: "/depot/stock",
    element: AddStock,
  },
];

export const nonAuthPages = [
  { name: "login", path: "/login", element: LoginPage },
  { name: "logout", path: "/logout", element: LogOutPage },
  { name: "pageNotFound", path: "*", element: PageNotFound },
  { name: "menu", path: "/menu", element: Menu },
];

export const refres = [
  {
    ref: "orders",
    title: "Commandes",
    elements: [
      {
        title: "Nouvelle Commande",
        link: "/orders/new",
        icon: <Package />,
      },
      {
        title: "Vos Commande",
        link: "/orders/list",
        icon: <Package2Icon />,
      },
    ],
  },
  {
    ref: "structure",
    title: "Structure",
    elements: [
      {
        title: "L'équipe",
        link: "/structure/teams",
        icon: <Users />,
      },
      { title: "Agences", link: "/structure/agences", icon: <Home /> },
      {
        title: "Clients",
        link: "/structure/clients",
        icon: <Users />,
      },
      {
        title: "Fournisseurs",
        link: "/structure/fournisseurs",
        icon: <Package />,
      },
    ],
  },
  {
    ref: "depot",
    title: "Dépot",
    elements: [
      {
        title: "Gestion des produits",
        link: "/products",
        icon: <Package />,
      },
      {
        title: "Gestion des Familles",
        link: "/families",
        icon: <Package />,
      },
      {
        title: "Gestion des Packs",
        link: "/packs",
        icon: <Package />,
      },
    ],
  },
];
