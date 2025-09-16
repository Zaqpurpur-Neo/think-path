import { LogOut } from "lucide-react";
import styles from "./Navbar.module.css";
import { useRouter } from "next/router";

function objToArray(obj = {}) {
	const array = []
	for (let item of Object.keys(obj)) {
		array.push(obj[item])
	}
	return array;
}

export default function Navbar({ pages, user, selectedPage, setSelectedPage, onLogout, normalRoute, isSlideOut = false}) {
	const router = useRouter();
	const pageser = objToArray(pages);

	return (
		<div className={`${styles.navbar} ${isSlideOut && styles.slideOut}`}>
			<h1 className={styles.title}>ThinkPath</h1>
			<ul>
				{pageser.map((item, idx) => {
					return <li 
						className={item.route === selectedPage ? styles.pageBtnSelected : styles.pageBtn} 
						key={idx} 
						onClick={() => { 
							if(router.pathname !== normalRoute) {
								router.push("/dashboard")
							}
							setSelectedPage(item.route)
						}}>
						<item.icon /><span>{item.route}</span>
					</li>
				})}
			</ul>

			<div className={styles.userInfo}>
				<p className={styles.username}>{user?.name}</p>
				<p className={styles.email}>{user?.email}</p>
			</div>
			<button className={styles.logout} onClick={onLogout}><LogOut />Logout</button>
		</div>
	)
}
