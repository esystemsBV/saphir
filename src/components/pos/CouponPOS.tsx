import { Button } from "../ui/button";
import NumPad from "../ui/NumPad";
import { useState } from "react";

const CouponPOS = ({
  setCoupontypePercentage,
  setCoupon,
  coupon,
  setAddCoupon,
}: {
  coupontypePercentage: boolean;
  setCoupontypePercentage: any;
  setCoupon: any;
  coupon: number;
  setAddCoupon: any;
}) => {
  const [cashcoupon, setCouponcash] = useState<number | string>(coupon);

  return (
    <>
      <div className="grid grid-cols-7 w-max gap-5">
        <section className="col-span-3 gap-5 grid grid-cols-3">
          {[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}].map((_, id) => (
            <Button
              className={`w-full text-xl h-full bg-blue-500 hover:bg-blue-600 ${
                (id + 1) * 10 == 100 && "col-span-3"
              }`}
              onClick={() => {
                setCoupon((id + 1) * 10);
                setCoupontypePercentage(true);
                setAddCoupon(false);
              }}
            >
              {(id + 1) * 10} %
            </Button>
          ))}
        </section>

        <div className="flex justify-center ">
          <div className=" border-l h-full" />
        </div>

        <section className=" space-y-5 col-span-3">
          <NumPad total={cashcoupon} setTotal={setCouponcash} />

          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => {
              setCoupon(cashcoupon);
              setCoupontypePercentage(false);
              setAddCoupon(false);
            }}
          >
            Appliquer le coupon
          </Button>
        </section>
      </div>
    </>
  );
};

export default CouponPOS;
