import ViewFamily from "@/components/depot/ViewFamily";
import ViewPack from "@/components/depot/ViewPack";
import ViewProduct from "@/components/depot/ViewProduct";
import AddStock from "@/pages/AddStock";
import BonDelLiv from "@/pages/bons/BonDeLiv";
import BonDeRtr from "@/pages/bons/BonDeRtr";
import DeliveryNoteView from "@/pages/bons/ViewBonDeLiv";
import RetourClientNoteView from "@/pages/bons/ViewBonDeRtr";
import Clients from "@/pages/clients/Clients";
import Fournisseurs from "@/pages/clients/Fournisseurs";
import Families from "@/pages/depot/GesFamilies";
import Packs from "@/pages/depot/GesPack";
import ProductsPage from "@/pages/depot/GesProductst";
import LoginPage from "@/pages/Login";
import LogOutPage from "@/pages/Logout";
import Menu from "@/pages/Menu";
import NewOrder from "@/pages/orders/newOrder";
import Orders from "@/pages/orders/Orders";
import PageNotFound from "@/pages/PageNotFound";
import Settings from "@/pages/Settings";
import Tests from "@/pages/Tests";
import {
  CircleDollarSign,
  HomeIcon,
  ListOrderedIcon,
  Plus,
  ShoppingBag,
  Users as UsersIcon,
  Settings as SettingsIcon,
  Package,
  Package2Icon,
  Home,
} from "lucide-react";
import Users from "@/pages/structure/Users";
import Agencies from "@/pages/structure/Agencies";

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
    icon: UsersIcon,
    children: [
      { label: "Équipes", to: "/structure/users" },
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
    name: "TEST",
    path: "/",
    element: Tests,
  },
  {
    name: "bon.retourclient",
    path: "/bon/retourclient",
    element: BonDeRtr,
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
    name: "retourclient.view",
    path: "/bon/retourclient/*",
    element: RetourClientNoteView,
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
    name: "orders",
    path: "/orders/list",
    element: Orders,
  },
  {
    name: "orders",
    path: "/structure/users",
    element: Users,
  },
  {
    name: "orders.new",
    path: "/orders/new",
    element: NewOrder,
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
  {
    name: "agencies",
    path: "/structure/agences",
    element: Agencies,
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
        link: "/structure/users",
        icon: <UsersIcon />,
      },
      { title: "Agences", link: "/structure/agences", icon: <Home /> },
      {
        title: "Clients",
        link: "/structure/clients",
        icon: <UsersIcon />,
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
