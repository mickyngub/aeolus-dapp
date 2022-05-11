import React from "react";
import "twin.macro";

const Dashboard = () => {
  return (
    <div tw="border-2 border-accent p-2">
      <p tw="text-lg">My position</p>
      <div tw="my-6 grid grid-cols-3">
        <div>Total Position</div>
      </div>
    </div>
  );
};

export default Dashboard;
