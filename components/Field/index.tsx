import { useState } from "react"
import styles from "./Field.module.css"

type Props = {
	type?: string,
	label?: string,
	placeholder?: string,
	named?: string,
	value?: any,
	isRequired?: boolean,
	isInvalid?: boolean,
	isForm?: boolean,
	onChange?: (e: any) => any,
	props?: any[]
}

export default function Field({
	type, named, label, value, placeholder, isRequired, isInvalid, isForm, onChange,
	...props
}: Props) {

	const [invalid, setInvalid] = useState(false);

	const labelMaker = label[0].toUpperCase() + label.slice(1, label.length)
	const customInvalid = (e) => {
		e.currentTarget.setCustomValidity('');
		setInvalid(true)
	}

	return (
		<div className={styles["input-root"]}>
			<label htmlFor={"id-" + named}>{labelMaker + " *"}</label>
			<input
				id={"id-" + named}
				className={invalid ? styles.invalid : ""}
				name={named || ""} 
				type={type} 
				placeholder={placeholder} 
				value={value} 
				onChange={onChange}
				autoComplete="off"
				required={isRequired}
				onInvalid={isForm ? customInvalid : null}
				{...props} />
			{isInvalid && <p className={styles["error-text"]}></p>}
		</div>
	)
}
