import React from "react";
import "./loader.css";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
    <div className="wrapper">
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="circle"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
      <div className="shadow"></div>
    </div>
    </div>
  );
}
