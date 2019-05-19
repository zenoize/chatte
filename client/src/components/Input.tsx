import React from "react";

export default (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="overflow-hidden w-100">
    <input {...props} className={"input " + props.className} />
  </div>
);
