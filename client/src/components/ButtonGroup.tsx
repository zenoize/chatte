import React from "react";

export interface IButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: any;
  radius?: string;
}

class ButtonGroup extends React.Component<IButtonGroupProps> {
  render() {
    let { radius } = this.props;
    if (!radius) radius = "100px";
    const childs = !this.props.children ? undefined : Array.isArray(this.props.children) ? this.props.children : [this.props.children];
    return (
      <div {...this.props} className={this.props.className}>
        {!childs
          ? ""
          : childs
              .filter(c => c !== undefined && c !== null)
              .map((c, i, a) => {
                const props: any = {
                  key: c.key || `${i}`
                };
                if (a.length === 1) props.style = { ...props.style, borderRadius: radius };
                else if (i === 0) props.style = { ...props.style, borderRadius: `${radius} 0px 0px ${radius}` };
                else if (i === a.length - 1) props.style = { ...props.style, borderRadius: `0px ${radius} ${radius} 0px` };
                else props.style = { ...props.style, borderRaduls: "0" };
                return React.cloneElement(c, props);
                // else return c;
              })}
      </div>
    );
  }
}

export default ButtonGroup;
