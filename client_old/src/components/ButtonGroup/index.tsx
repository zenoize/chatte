import React from "react";
import "./styles.css";

import Button from "../Button";

export interface IButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<Button>[];
}

class ButtonGroup extends React.Component<IButtonGroupProps> {
  render() {
    // const { buttons } = this.props;
    const childs = !this.props.children ? undefined : Array.isArray(this.props.children) ? this.props.children : [this.props.children];
    return (
      <div {...this.props} className={`button-group ${this.props.className || ""}`}>
        {!childs
          ? ""
          : childs.map((c, i) => {
              const props: any = {
                key: c.key || `${i}`
              };
              if (i === 0) props.className = "button-group-button-left";
              else if (i === childs.length - 1) props.className = "button-group-button-right";
              else props.className = "button-group-button-center";
              return React.cloneElement(c, props);
              // else return c;
            })}
      </div>
    );
  }
}

export default ButtonGroup;
