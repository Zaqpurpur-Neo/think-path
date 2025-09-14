import styles from "./Button.module.css";

export default function Button({ children, disabled = false, outline = false, ...props }) {
	return (
		<button className={`${outline ? styles.outline : styles.btn} ${disabled ? styles.disabled : ""}`} {...props}>
			{children}
		</button>
	)
}
