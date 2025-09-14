import { v4 as uuidv4 } from "uuid"

const API_URL = "http://localhost:3000/api/auth"

async function testRegister() { 
	const res = await fetch(API_URL + "/register", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			id: uuidv4(),
			email: "nemor@gmail.com",
			password: "nemor",
			name: "Jonny",
			educationLevel: "High School",
			birthday: new Date("2002-03-15")
		})
	});

	const data = await res.json();
	console.log("REGISTER:", data)
}

async function testLogin() {
	const res = await fetch(API_URL + "/login", { 
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: "nemor@gmail.com",
			password: "nemor"
		})
	})

	const data = await res.json();
	console.log("LOGIN: ", data);
	return data.token
}

async function testGetProfile(token) {
	const res = await fetch(API_URL + "/profile", {
		method: "GET",
		headers: { 
			Authorization: `Bearer ${token}`
		},
	})

	const data = await res.json();
	console.log("PROFILE", data)
}

(async()=>{
	await testRegister();
	const token = await testLogin();
	if(token) await testGetProfile(token);
})()
