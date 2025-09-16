import Button from "@/components/Button";
import Field from "@/components/Field";
import { useRouter } from "next/router";
import { useState } from "react";

import styles from "@/styles/Register.module.css"
import Link from "next/link";
import Loader from "@/components/Loader";
import { axim } from "@/lib/axim";

export default function Login() {
	const router = useRouter();
	const [form, setForm] = useState({
		email: "",
		password: ""
	})
	const [error, setError] = useState(null);
	const [isSubmitted, setIsSubmitted] = useState(false)
	
	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsSubmitted(true);

		const res = await axim("/api/auth/login").post(form)
		const data = await res.json();

		if(!res.ok) {
			setError(data.error);
			setIsSubmitted(false)
		} else {
			localStorage.setItem("token", data.token);
			window.location.href = "/dashboard"
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.twoSide}>
				<div className={styles.leftSide}>
					<img src="/images/bg.jpg" />
				</div>

				<div className={styles.rightSide}>
					<div className={styles.header}>
						<h1>Selamat Datang Lagi</h1>
						<p className={styles.subTitle}>Belum punya akun? <Link href="/register">Register</Link></p>
						{error && <p>{error}</p>}
					</div>
					<form onSubmit={handleSubmit}>
						<Field 
							type="email" 
							label="email" 
							named="email" 
							placeholder="name@gmail.com" 
							value={form.email} 
							onChange={handleChange} 
							isForm={true}
							isRequired={true} />	

						<Field 
							type="password" 
							named="password" 
							label="Password"
							placeholder="Password" 
							value={form.password} 
							onChange={handleChange}
							isForm={true}
							isRequired={true} />

						<Button style={{
							marginTop: "1em",
							textAlign: "center"
						}} type="submit">{isSubmitted ? <Loader /> : "Login"}</Button>
					</form>
				</div>
			</div>
		</div>
	)
}
