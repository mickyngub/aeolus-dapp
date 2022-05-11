import React from "react";
import "twin.macro";

const Dashboard = () => {
  return (
    <div tw="border-2 border-accent">
      <p>My position</p>
      <div tw="my-6 grid grid-cols-3">
        <div>Total Supply</div>
        <div>Total Borrow</div>
        <div>Total Position</div>
        <div>Current Price</div>
        <div>Estimate APR</div>
      </div>
    </div>
  );
};

export default Dashboard;
