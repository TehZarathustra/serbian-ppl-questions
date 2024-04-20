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
	image?: string
	seen: number
	variants: Record<string, string>
	correctAnswer: string
	correctAnswers: number
}

export interface QuizProps {
	data: QuestionItem[]
}
