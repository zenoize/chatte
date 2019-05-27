import React from "react";

export default React.forwardRef((props: any, ref) => {
  const inputProps = { ...props, children: undefined }
  return (
    <div className="overflow-hidden w-100 position-relative">
      <input ref={ref} {...inputProps} className={"input " + (props.className || "")} />
      {props.children}
    </div>
  );
});
