import React from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";

const PongContainerWithNoSSR = dynamic(
  () => import("../src/features/pong/PongContainer"),
  {
    ssr: false,
  }
);

export const PongApp: NextPage = (props) => {
  return (
    <div className="appContainer">
      <PongContainerWithNoSSR />
    </div>
  );
};

export default PongApp;
