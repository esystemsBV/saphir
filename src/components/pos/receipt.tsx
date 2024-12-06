import { useTranslation } from "react-i18next";

interface ReceiptProps {
  transaction: {
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
  };
}

export function Receipt({ transaction }: ReceiptProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold mb-2">{t("itemsPurchased")}</h3>
      <ul className="mb-4">
        {transaction.items.map((item, index) => (
          <li key={index} className="flex justify-between">
            <span>
              {t(item.name.toLowerCase())} x{item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="text-xl font-bold">
        {t("total")}: ${transaction.total.toFixed(2)}
      </div>
    </div>
  );
}
