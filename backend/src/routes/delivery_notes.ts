import express from "express";
import { customAlphabet } from "nanoid";
import { db } from "../config/sqldb";
import { products } from "../types";
const router = express.Router();

router.get("/get/:reference", (req, res) => {
  const { reference } = req.params;

  const query = `
          SELECT 
        dn.reference,
        dn.delivery_date,
        dn.created_date,
        dn.type,
        dn.remise,
        dn.status,
        CASE 
            WHEN dn.type = 'pos' THEN 'pos' 
            ELSE c.fullname
        END AS client_fullname,
        CASE 
            WHEN dn.type = 'pos' THEN '' 
            ELSE c.phone 
        END AS client_phone,
        'product' AS item_type, -- Indicates it's a product
        p.name AS item_name,
        p.image AS item_image,
        dnp.quantity AS item_quantity,
        dnp.price AS item_price,
        ((dnp.quantity * dnp.price) - dn.remise) AS item_total_price
      FROM delivery_notes dn
      LEFT JOIN clients c ON dn.client_reference = c.reference AND dn.type != 'pos'
      JOIN delivery_note_products dnp ON dn.reference = dnp.delivery_note_reference
      JOIN products p ON dnp.product_reference = p.reference
      WHERE dn.reference = ?

      UNION ALL

      SELECT 
        dn.reference,
        dn.delivery_date,
        dn.created_date,
        dn.type,
        dn.remise,
        dn.status,
        CASE 
            WHEN dn.type = 'pos' THEN 'pos' 
            ELSE c.fullname
        END AS client_fullname,
        CASE 
            WHEN dn.type = 'pos' THEN '' 
            ELSE c.phone 
        END AS client_phone,
        'pack' AS item_type, -- Indicates it's a pack
        pk.name AS item_name,
        pk.image AS item_image,
        dnpk.quantity AS item_quantity,
        dnpk.price AS item_price,
        ((dnpk.quantity * dnpk.price) - dn.remise) AS item_total_price
      FROM delivery_notes dn
      LEFT JOIN clients c ON dn.client_reference = c.reference AND dn.type != 'pos'
      JOIN delivery_note_packs dnpk ON dn.reference = dnpk.delivery_note_reference
      JOIN packs pk ON dnpk.pack_reference = pk.reference
      WHERE dn.reference = ?
`;

  db.query(query, [reference, reference], (err, results: any) => {
    if (err) {
      return res.json({ success: false, error: err });
    }

    if (results.length === 0) {
      return res.json({ success: false, message: "Delivery note not found" });
    }

    const totalPrice = results.reduce((sum: number, row: any) => {
      return sum + +row.item_total_price;
    }, 0);

    // Separate products and packs into different arrays
    const products = results
      .filter((row: any) => row.item_type === "product")
      .map((row: any) => ({
        name: row.item_name,
        quantity: row.item_quantity,
        price: row.item_price,
        image: row.item_image,
        total_price: row.item_total_price,
      }));

    const packs = results
      .filter((row: any) => row.item_type === "pack")
      .map((row: any) => ({
        name: row.item_name,
        quantity: row.item_quantity,
        price: row.item_price,
        image: row.item_image,
        total_price: row.item_total_price,
      }));

    const deliveryNote = {
      reference: results[0].reference,
      delivery_date: results[0].delivery_date,
      client_fullname:
        results[0].type === "client" ? results[0].client_fullname : null,
      client_phone:
        results[0].type === "client" ? results[0].client_phone : null,
      status: results[0].status,
      type: results[0].type,
      remise: results[0].remise,
      total_price: totalPrice,
      products,
      packs,
    };

    return res.json({ success: true, data: deliveryNote });
  });
});

router.post("/add", (req, res) => {
  const { delivery_date, type, client_reference, products, status, packs } =
    req.body;

  const referenceInDo = customAlphabet("1234567890", 9);
  const reference = referenceInDo();

  const deliveryNoteQuery = `
      INSERT INTO delivery_notes (reference, delivery_date, type, client_reference, status)
      VALUES (?, ?, ?, ?, ?)
    `;

  const productQuery = `
        INSERT INTO delivery_note_products 
          (delivery_note_reference, product_reference, quantity, price)
        VALUES ?
      `;

  const packQuery = `
        INSERT INTO delivery_note_packs 
          (delivery_note_reference, pack_reference, quantity, price)
        VALUES ?
      `;

  const stockQuery = `    
    UPDATE stock 
    SET quantity = quantity - ?
    WHERE product_id = ?`;

  const transactions = `INSERT INTO transactions (product_id, transaction_type, quantity, source, transaction_date) VALUES (?, ?, ?, ?, ?)`;

  const deliveryNoteValues = [
    reference,
    delivery_date,
    type,
    type === "pos" ? null : client_reference,
    status || "in_progress",
  ];

  db.query(deliveryNoteQuery, deliveryNoteValues, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const productQueries = products.map((product: any) => {
      const { product_reference, quantity, price } = product;
      return [reference, product_reference, quantity, price];
    });

    db.query(productQuery, [productQueries], (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      } else {
        const productsQueriesAloos = products.map((product: any) => {
          const { quantity, product_reference } = product;
          return [quantity, product_reference];
        });

        const updateStock = async () => {
          try {
            for (let i = 0; i < productsQueriesAloos.length; i++) {
              const [quantity, product_reference] = productsQueriesAloos[i];

              await new Promise((resolve, reject) => {
                db.query(
                  stockQuery,
                  [quantity, product_reference],
                  (err, result) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(result);
                    }
                  }
                );
              });

              await new Promise((resolve, reject) => {
                db.query(
                  transactions,
                  [product_reference, "down", quantity, "bondeliv", new Date()],
                  (err, result) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(result);
                    }
                  }
                );
              });
            }

            const setPacks = () => {
              const packsQueries = packs.map((pack: any) => {
                const { pack_reference, quantity, price } = pack;
                return [reference, pack_reference, quantity, price];
              });

              db.query(packQuery, [packsQueries], (err, result) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ success: false, error: err.message });
                } else {
                  res.status(201).json({
                    success: true,
                  });
                }
              });
            };

            setPacks();
          } catch (err) {
            res.status(500).json({
              success: false,
              error: err,
            });
          }
        };

        updateStock();
      }
    });
  });
});

router.put("/edit/:reference", (req, res) => {
  const { delivery_date, products } = req.body;
  const { reference } = req.params;

  const updateDeliveryNoteQuery = `
    UPDATE delivery_notes 
    SET delivery_date = ?
    WHERE reference = ?
  `;
  const deliveryNoteValues = [delivery_date, reference];

  const deleteProductsQuery = `
    DELETE FROM delivery_note_products 
    WHERE delivery_note_reference = ?
  `;

  const insertProductsQuery = `
    INSERT INTO delivery_note_products 
      (delivery_note_reference, product_reference, quantity, price)
    VALUES ?
  `;

  db.query(updateDeliveryNoteQuery, deliveryNoteValues, (err) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    db.query(deleteProductsQuery, [reference], (err) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }

      if (!products || products.length === 0) {
        return res
          .status(200)
          .json({ success: true, message: "Updated without products." });
      }

      const productValues = products.map((product: any) => [
        reference,
        product.product_reference,
        product.quantity,
        product.price,
      ]);

      db.query(insertProductsQuery, [productValues], (err) => {
        if (err) {
          return res.status(500).json({ success: false, error: err.message });
        }

        res.status(200).json({
          success: true,
          message: "Delivery note updated successfully.",
        });
      });
    });
  });
});

router.get("/fetch/all", (req, res) => {
  const query = `
    SELECT 
      dn.reference AS delivery_note_reference,
      dn.delivery_date,
      dn.created_date,
      dn.type,
      dn.remise,
      dn.status,
      CASE 
          WHEN dn.type = 'pos' THEN NULL 
          ELSE c.fullname 
      END AS client_fullname,
      CASE 
          WHEN dn.type = 'pos' THEN NULL 
          ELSE c.phone 
      END AS client_phone,
      p.name AS product_name,
      p.image AS product_image,
      pa.image AS pack_image,
      pa.name AS pack_name,
      dnp.quantity,
      dnp.price,
      dnpa.quantity,
      dnpa.price,
      ((dnp.quantity * dnp.price) - dn.remise) +  ((dnpa.quantity * dnpa.price) - dn.remise) AS total_price
    FROM delivery_notes dn
    LEFT JOIN clients c ON dn.client_reference = c.reference AND dn.type != 'pos'
    LEFT JOIN delivery_note_products dnp ON dn.reference = dnp.delivery_note_reference
    LEFT JOIN delivery_note_packs dnpa ON dn.reference = dnpa.delivery_note_reference
    LEFT JOIN products p ON dnp.product_reference = p.reference
    LEFT JOIN packs pa ON dnpa.pack_reference = pa.reference
    ORDER BY dn.created_date DESC;
  `;

  db.query(query, (err, results: any) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    const groupedData = results.reduce((acc: any, row: any) => {
      if (!acc[row.delivery_note_reference]) {
        acc[row.delivery_note_reference] = {
          reference: row.delivery_note_reference,
          delivery_date: row.delivery_date,
          created_date: row.created_date,
          type: row.type,
          status: row.status,
          total_price: +row.total_price,
          client:
            row.type === "pos"
              ? null
              : {
                  fullname: row.client_fullname,
                  phone: row.client_phone,
                },
          products: [],
          packs: [],
        };
      }

      if (row.product_name) {
        acc[row.delivery_note_reference].products.push({
          name: row.product_name,
          quantity: row.quantity,
          sellPrice: +row.price,
          image: row.product_image,
          total_price: +row.product_total_price,
        });
      }

      if (row.pack_name) {
        acc[row.delivery_note_reference].packs.push({
          name: row.product_name,
          quantity: row.quantity,
          sellPrice: +row.price,
          image: row.product_image,
          total_price: +row.product_total_price,
        });
      }

      return acc;
    }, {});

    const deliveryNotes = Object.values(groupedData);

    return res.status(200).json({
      success: true,
      data: deliveryNotes.sort(
        (a: any, b: any) =>
          new Date(b.delivery_date).getTime() -
          new Date(a.delivery_date).getTime()
      ),
    });
  });
});

router.post("/addpos", (req, res) => {
  const { delivery_date, type, client_reference, products, status, remise } =
    req.body;
  const referenceInDo = customAlphabet("123456789", 9);
  const referenceAll = +referenceInDo();

  const deliveryNoteQuery = `
      INSERT INTO delivery_notes (reference, delivery_date, type, client_reference, status, remise)
      VALUES (?, ?, ?, ?, ?, ?)
      `;
  const productQuery = `
        INSERT INTO delivery_note_products 
          (delivery_note_reference, product_reference, quantity, price)
        VALUES ?
      `;
  const stockQuery = `    
    UPDATE stock 
    SET quantity = quantity - ?
    WHERE product_id = ?`;

  const transactions = `INSERT INTO transactions (product_id, transaction_type, quantity, source, transaction_date) VALUES (?, ?, ?, ?, ?)`;

  const deliveryNoteValues = [
    referenceAll,
    delivery_date,
    type,
    type === "pos" ? null : client_reference,
    status || "in_progress",
    remise || 0,
  ];

  db.query(deliveryNoteQuery, deliveryNoteValues, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, msg: deliveryNoteValues, error: err.message });
    }

    const productQueries = products.map((product: products) => {
      const { reference, quantity, sellPrice } = product;
      return [referenceAll, reference, quantity, sellPrice];
    });

    db.query(productQuery, [productQueries], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, msg: "2", error: err.message });
      } else {
        const productsQueriesAloos = products.map((product: products) => {
          const { quantity, reference } = product;
          return [quantity, reference];
        });

        const updateStock = async () => {
          try {
            for (let i = 0; i < productsQueriesAloos.length; i++) {
              const [quantity, reference] = productsQueriesAloos[i];

              await new Promise((resolve, reject) => {
                db.query(stockQuery, [quantity, reference], (err, result) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
                });
              });

              await new Promise((resolve, reject) => {
                db.query(
                  transactions,
                  [reference, "down", quantity, "pos", new Date()],
                  (err, result) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(result);
                    }
                  }
                );
              });
            }

            res.status(201).json({
              success: true,
            });
          } catch (err) {
            res.status(500).json({
              success: false,
              error: err,
            });
          }
        };

        updateStock();
      }
    });
  });
});

export const delivery_notesRoutes = router;
