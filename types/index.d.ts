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

export type QuestionOptionKey = "A" | "B" | "C" | "D" | "E";

export type QuestionProperty = "image-question" | "image-answer" | "table" | undefined

export interface Question {
	id: string;
	text: string;
	property: QuestionProperty[]; // always an array, default [] 
	options: Record<QuestionOptionKey, string>;
	answer: QuestionOptionKey;
	image: string | null;
	"image-description": string | null,
	"answer-description": string | null,
	table: null | {
		columns: any;
		columns: any[][]
	};
	ai_context: any | null; // flexible for extra data
}

export interface QuestionSet {
	questions: Question[];
}

