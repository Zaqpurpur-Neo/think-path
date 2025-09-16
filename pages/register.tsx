import Link from "next/link";
import { useRouter } from "next/navigation"
import { useState } from "react";

import Field from "@/components/Field";
import Button from "@/components/Button";
import Select from "@/components/Select";

import styles from "@/styles/Register.module.css"
import DatePicker from "@/components/DatePicker";
import Loader from "@/components/Loader";
import { axim } from "@/lib/axim";

export default function Register() {
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		retryPassword: "",
		educationLevel: "",
		birthday: "",
	})
	const [error, setError] = useState<string | null>(null);
	const [isSubmitted, setIsSubmitted] = useState(false)

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSumbit = async (e) => {
		e.preventDefault();
		setError(null);
		setIsSubmitted(true);

		if(form.password !== form.retryPassword) {
			setError("Password Tidak Sama");
			setIsSubmitted(false)
			return;
		}

		if(form.educationLevel.length <= 0) {
			setError("Pilih Jenjang Anda");
			setIsSubmitted(false)
			return;
		}

		if(form.birthday.length <= 0) {
			setError("Masukan Tanggal Lahir Anda");
			setIsSubmitted(false)
			return;
		}
		
		const res = await axim("/api/auth/register").post(form)
		const data = await res.json();

		if(!res.ok) {
			setError(data.message);
			setIsSubmitted(false)
		}
		else router.push("/login");
	}

	return (
		<div className={styles.container}>
			<div className={styles.twoSide}>
				<div className={styles.leftSide}>
					<img src="/images/bg.jpg" />
				</div>

				<div className={styles.rightSide}>
					<div className={styles.header}>
						<h1>Buat Akun</h1>
						<p className={styles.subTitle}>Sudah punya akun? <Link href="/login">Log In</Link></p>
						{error && <p>{error}</p>}
					</div>
					<form onSubmit={handleSumbit}>
						<Field 
							named="name" 
							label="Username" 
							placeholder="Nama Anda" 
							value={form.name} 
							onChange={handleChange} 
							isForm={true}
							isRequired={true} />

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

						<Field 
							type="password" 
							named="retryPassword" 
							label="Re-entry Password"
							placeholder="Re-entry Password" 
							value={form.retryPassword} 
							onChange={handleChange}
							isForm={true}
							isRequired={true} />
					
						<Select 
							named="educationLevel"
							value={form.educationLevel}
							onChange={(name, value) => {
								setForm({ ...form, [name]: value })
							}}
							title="Pilih Jenjang"
							label="Jenjang"
							items={["SD", "SMP", "SMA", "S1"]}
						/>

						<DatePicker
							title="Tanggal Lahir"
							name="birthday" 
							value={form.birthday} 
							onChange={(name, value) => {
								const date = new Date(value);
								setForm({ ...form, [name]: date })
							}}
						/>
						<Button style={{
							marginTop: "1em"
						}} type="submit">{isSubmitted ? <Loader /> : "Register"}</Button>
					</form>
				</div>
			</div>
		</div>
	)
}
