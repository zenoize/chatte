import React from "react";
import "./styles.css";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // color: string;
}

class Button extends React.Component<IButtonProps> {
  render() {
    return <button {...this.props} className={`button ${this.props.className || ""}`} />;
  }
}

export default Button;
