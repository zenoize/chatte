import React from "react";

export interface IButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: any;
}

class ButtonGroup extends React.Component<IButtonGroupProps> {
  render() {
    // const { buttons } = this.props;
    const childs = !this.props.children ? undefined : Array.isArray(this.props.children) ? this.props.children : [this.props.children];
    return (
      <div {...this.props} className={this.props.className}>
        {!childs
          ? ""
          : childs.map((c, i) => {
              if (!c) return c;
              const props: any = {
                key: c.key || `${i}`
              };
              if (i === 0) props.style = { ...props.style, borderRadius: "100px 0px 0px 100px" };
              else if (i === childs.length - 1) props.style = { ...props.style, borderRadius: "0px 100px 100px 0px" };
              else props.style = { ...props.style, borderRaduls: "0" };
              return React.cloneElement(c, props);
              // else return c;
            })}
      </div>
    );
  }
}

export default ButtonGroup;
