import React from "react";
import "./styles.css";

export interface IInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // color: string;
}

class InputField extends React.Component<IInputFieldProps> {
  render() {
    return <input {...this.props} autoComplete="off" className={`input-field ${this.props.className || ""}`} />;
  }
}

export default InputField;
