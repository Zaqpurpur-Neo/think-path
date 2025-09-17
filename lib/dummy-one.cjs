const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

function getRandomName() {
	const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah", "Ian", "Julia", "Kevin", "Laura", "Michael", "Nina", "Oscar", "Paula", "Quinn", "Ryan", "Sophia", "Tom", "Uma", "Victor", "Wendy", "Xander", "Yara", "Zane"];
	const lastNames = ["Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall"];
	const first = firstNames[Math.floor(Math.random() * firstNames.length)];
	const last = lastNames[Math.floor(Math.random() * lastNames.length)];
	return `${first} ${last}`;
}

function getRandomEmail(name) {
	const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com", "test.com"];
	const handle = name.toLowerCase().replace(/\s+/g, ".");
	const domain = domains[Math.floor(Math.random() * domains.length)];
	const number = Math.floor(Math.random() * 1000); // add random number to reduce duplicates 
	return `${handle}${number}@${domain}`;
}

async function createFakeUsersAndAttempts({
	fakeUsers = 50,
	questionsPerBab = 10,
	babs = 5,
	maxAttemptsPerQuestion = 1 
} = {}) {
	const createdUsers = [];
	for (let i = 0; i < fakeUsers; i++) {
	    const name = getRandomName();
		const email = getRandomEmail(name);
	    const user = await prisma.user.create({
		    data: {
			    id: `fake-${Date.now()}-${i}`,
			    name,
			    email,
			    educationLevel: "other",
			    password: "fake", 
		   },
	   });
	   createdUsers.push(user);
    }

	for (const user of createdUsers) {
		for (let qId = 1; qId <= 20; qId++) {
			const isCorrect = Math.random() < 0.4;

			await prisma.testAttempt.upsert({
				where: {
					userId_testId: {
						userId: user.id,
						testId: qId,
					},
				},
				update: {
					answer: isCorrect ? "CORRECT_CHOICE" : "WRONG_CHOICE",
					isCorrect,
					attemptedAt: new Date(),
				},
				create: {
					userId: user.id,
					testId: qId,
					answer: isCorrect ? "CORRECT_CHOICE" : "WRONG_CHOICE",
					isCorrect,
				},
			});
		}
	}

	console.log(`Created ${createdUsers.length} fake users with attempts.`);
}

module.exports = {
	createFakeUsersAndAttempts
}
