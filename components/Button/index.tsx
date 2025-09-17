import React, { JSX, ReactNode, useEffect, useRef } from "react";
import styles from "./Button.module.css";

type ArgElement = Element & ReactNode

interface Props {
	children?: ReactNode | JSX.Element | (ReactNode | JSX.Element)[];
	disabled?: boolean;
	outline?: boolean;
	onClick?: (...arg) => void | never | any;
	style?: any,
	type?: any,
	props?: React.ButtonHTMLAttributes<HTMLButtonElement>[]
}

const Button: React.FC<Props> = ({ children, disabled = false, outline = false, ...props }) => {

	return (
		<button className={`${outline ? styles.outline : styles.btn} ${disabled ? styles.disabled : ""}`} {...props}>
			<>{children}</>
		</button>
	)
}

export default Button;
