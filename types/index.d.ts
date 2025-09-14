export type User = {
	id: string;
	email: string;
	name: string | null;
	birthday: string | null;
	educationLevel: string | null;
};

export type UserContextType = {
	user: User | null;
	loading: boolean;
	refreshUser: () => Promise<void>;
};
