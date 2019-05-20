import React from "react";

export default React.forwardRef((props: any, ref) => (
  <div className="overflow-hidden w-100">
    <input ref={ref} {...props} className={"input " + props.className} />
  </div>
));
