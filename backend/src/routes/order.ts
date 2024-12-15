import express from "express";
import { db } from "../config/sqldb";
const router = express.Router();
import { customAlphabet } from "nanoid";

router.post("/add", (req, res) => {
  const referenceInDo = customAlphabet("1234567890", 9);
  const referenceX = referenceInDo();

  const {
    fullname,
    phone,
    whatsapp,
    address,
    city,
    agence,
    livreur,
    preparateur,
    ncolis,
    notes,
    payment_method,
    is_company,
    order_date,
    order_time,
    ice,
    siegesocial,
    raisonsocial,
    products,
  } = req.body;

  const q = `
    INSERT INTO orders 
        (reference, fullname, phone, whatsapp, address, city, agence, livreur, 
        preparateur, ncolis, notes, payment_method, is_company, order_date, order_time, siegesocial, ice, raisonsocial) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         `;

  const values = [
    referenceX,
    fullname,
    phone,
    whatsapp,
    address,
    city,
    agence,
    livreur,
    preparateur,
    ncolis,
    notes,
    payment_method,
    is_company,
    order_date,
    order_time,
    siegesocial,
    ice,
    raisonsocial,
  ];

  const q2 =
    "INSERT INTO order_products (order_reference, product_reference, quantity) VALUES (?, ?, ?)";

  db.query(q, values, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    } else {
      products.map((product: any) => {
        const { reference, quantity } = product;
        db.query(q2, [referenceX, reference, quantity], (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, error: err.message });
          } else {
            return res.status(200).json({
              success: true,
              order_reference: referenceX,
            });
          }
        });
      });
    }
  });
});

router.get("/", (req, res) => {
  const q = `
    SELECT 
        o.reference,
        o.order_date,
        o.order_time,
        p.reference AS product_reference,
        p.sellPrice AS sellprice,
        op.quantity,
        a.name AS agence,
        CONCAT(d_user.fname, " ", d_user.lname) AS livreur,
        CONCAT(p_user.fname, " ", p_user.lname) AS preparateur,
        o.fullname,
        o.phone,
        o.whatsapp,
        o.address,
        o.city,
        o.ncolis,
        o.notes,
        o.payment_method,
        o.is_company,
        o.statut,
        o.siegesocial,
        o.ice,
        o.raisonsocial
    FROM 
        orders o
    LEFT JOIN 
        order_products op ON o.reference = op.order_reference
    LEFT JOIN
        products p ON op.product_reference = p.reference
    LEFT JOIN 
        agencies a ON o.agence = a.reference
    LEFT JOIN 
        users d_user ON o.livreur = d_user.reference
    LEFT JOIN 
        users p_user ON o.preparateur = p_user.reference
    ORDER BY 
        o.order_date DESC, o.order_time DESC
  `;

  db.query(q, (err, results: any) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const groupedData = results.reduce((acc: any, row: any) => {
      if (!acc[row.reference]) {
        acc[row.reference] = {
          reference: row.reference,
          order_date: row.order_date,
          order_time: row.order_time,
          agence: row.agence,
          livreur: row.livreur,
          preparateur: row.preparateur,
          fullname: row.fullname,
          phone: row.phone,
          whatsapp: row.whatsapp,
          address: row.address,
          city: row.city,
          ncolis: row.ncolis,
          notes: row.notes,
          payment_method: row.payment_method,
          is_company: row.is_company,
          statut: row.statut,
          siegesocial: row.siegesocial,
          ice: row.ice,
          raisonsocial: row.raisonsocial,
          products: [],
        };
      }

      if (row.product_reference) {
        const productTotal = row.sellprice * row.quantity;
        acc[row.reference].products.push({
          reference: row.product_reference,
          name: row.product_name,
          image: row.product_image,
          quantity: row.quantity,
          sellPrice: row.sellprice,
        });
        acc[row.reference].total_price += productTotal;
      }

      return acc;
    }, {});

    const orders = Object.values(groupedData);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  });
});

router.get("/fetch/:reference", (req, res) => {
  const reference = req.params.reference;

  const q = `
    SELECT 
        o.reference,
        o.order_date, 
        o.createdAt, 
        o.order_time,
        p.reference AS product_reference, 
        p.name AS product_name, 
        p.sellPrice AS sellprice,
        op.quantity,
        a.name AS agence,
        CONCAT(d_user.fname, " ", d_user.lname) AS livreur,
        CONCAT(p_user.fname, " ", p_user.lname) AS preparateur,
        o.fullname,
        o.phone,
        o.whatsapp,
        o.address,
        o.city,
        o.ncolis,
        o.notes,
        o.payment_method,
        o.is_company,
        o.statut,
        o.siegesocial,
        o.ice,
        o.raisonsocial
    FROM 
        orders o
    LEFT JOIN 
        order_products op ON o.reference = op.order_reference
    LEFT JOIN
        products p ON op.product_reference = p.reference
    LEFT JOIN 
        agencies a ON o.agence = a.reference
    LEFT JOIN 
        users d_user ON o.livreur = d_user.reference
    LEFT JOIN 
        users p_user ON o.preparateur = p_user.reference
    WHERE 
        o.reference = ?
  `;

  db.query(q, [reference], (err, results: any) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const groupedData = results.reduce((acc: any, row: any) => {
      if (!acc[row.reference]) {
        acc[row.reference] = {
          reference: row.reference,
          order_date: row.order_date,
          order_time: row.order_time,
          agence: row.agence,
          createdAt: row.createdAt,
          livreur: row.livreur,
          preparateur: row.preparateur,
          fullname: row.fullname,
          phone: row.phone,
          whatsapp: row.whatsapp,
          address: row.address,
          city: row.city,
          ncolis: row.ncolis,
          notes: row.notes,
          payment_method: row.payment_method,
          is_company: row.is_company,
          statut: row.statut,
          siegesocial: row.siegesocial,
          ice: row.ice,
          raisonsocial: row.raisonsocial,
          products: [],
        };
      }

      if (row.product_reference) {
        const productTotal = row.sellprice * row.quantity;
        acc[row.reference].products.push({
          reference: row.product_reference,
          name: row.product_name,
          quantity: row.quantity,
          sellPrice: row.sellprice,
        });
        acc[row.reference].total_price += productTotal;
      }

      return acc;
    }, {});

    const orders = Object.values(groupedData);

    return res.status(200).json({
      success: true,
      data: orders[0],
    });
  });
});

router.get("/byuserrole&reference/:reference", (req, res) => {
  const { reference } = req.params;

  const query = `
  SELECT 
    o.reference AS order_reference,
    o.order_date,
    o.order_time,
    p.reference AS product_reference,
    p.sellPrice AS sellPrice,
    p.name AS name,
    p.image AS image,
    op.quantity,
    a.name AS agence,
    o.fullname,
    o.notes,
    o.phone,
    o.whatsapp,
    o.address,
    o.livreur,
    o.preparateur,
    o.city,
    o.ncolis,
    o.notes,
    o.payment_method,
    o.is_company,
    o.statut,
    o.siegesocial,
    o.ice,
    o.raisonsocial,
    CASE 
      WHEN o.preparateur = ? AND o.statut = 'new' THEN 'preparateur'
      WHEN o.livreur = ? AND o.statut IN ('collected', 'shipping', 'delivered') THEN 'livreur'
      ELSE NULL
    END AS assigned_role
  FROM 
    orders o
  LEFT JOIN 
    order_products op ON o.reference = op.order_reference
  LEFT JOIN 
    products p ON op.product_reference = p.reference
  LEFT JOIN 
    agencies a ON o.agence = a.reference
  WHERE 
    (
      (o.preparateur = ? AND o.statut = 'new') OR
      (o.livreur = ? AND o.statut IN ('prepared', 'collected', 'shipping', 'delivered'))
    )
  ORDER BY 
    o.order_date ASC;
`;

  db.query(
    query,
    [reference, reference, reference, reference],
    (err, results: any) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      const groupedOrders = results.reduce((acc: any, order: any) => {
        const orderReference = order.order_reference;

        if (!acc[orderReference]) {
          acc[orderReference] = {
            ...order,
            products: [],
          };
          delete acc[orderReference].product_reference;
          delete acc[orderReference].sellPrice;
          delete acc[orderReference].quantity;
        }

        acc[orderReference].products.push({
          reference: order.product_reference,
          sellPrice: order.sellPrice,
          quantity: order.quantity,
          name: order.name,
          image: order.image,
        });

        return acc;
      }, {});

      const finalOrders = Object.values(groupedOrders);

      const ordered = finalOrders.sort((a: any, b: any) => {
        const dateTimeA: any = new Date(`${a.order_date}`);
        const dateTimeB: any = new Date(`${b.order_date}`);
        return dateTimeA - dateTimeB;
      });

      return res.status(200).json({
        success: true,
        data: ordered,
      });
    }
  );
});

router.post("/changeStatus/:reference/:status", (req, res) => {
  const { reference, status } = req.params;

  const query = `UPDATE orders SET statut = ? WHERE reference = ?`;

  db.query(query, [status, reference], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    return res.status(200).json({
      success: true,
    });
  });
});

export const ordersRoutes = router;
