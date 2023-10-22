export interface ResultItem {
	id: string
	answer: string
	correct: boolean
	correctAnswer: string
	question: string
	theme: string
}

export interface QuestionItem {
	id: string
	title: string
	theme: string
	variants: Record<string, string>
}

export interface QuizProps {
	data: QuestionItem[]
}
