import React from "react";
import CouponForm from "./couponForm";
import CouponList from "./CouponList";

const CouponManagement = () => {
  return (
    <div className="p-10">
    <div className="mb-3">
      <h2 className="h1 mb-0 text-capitalize d-flex align-items-center gap-2">
        <img
          src="/coupon_setup.png"
          alt=""
        />
        Coupon setup
      </h2>
    </div>

      <CouponForm />
     
      <CouponList />
     
    
    </div>
  );

};

export default CouponManagement;
