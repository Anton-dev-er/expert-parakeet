import React, {FC} from "react";
import styles from "./Button.module.scss";

interface Button {
  children: React.ReactNode;
  onClick: () => void,
  type?: "" | "transparent" | "outlined";
}

const Button: FC<Button> = ({children, type, onClick}) => {
  const handleOptions = () => {
    let newClasses = [];

    if (type) {
      if (type === "transparent") {
        newClasses.push(styles.transparent);
      } else if (type === "outlined") {
        newClasses.push(styles.outlined);
      }
    }

    return newClasses.join(" ");
  };

  return (
      <button onClick={onClick} className={`${styles.button} ${handleOptions()}`}>
        {children}
      </button>
  );
};

export default Button;
