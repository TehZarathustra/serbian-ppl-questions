import {Question, Questions} from './types'

const LOCAL_STORAGE_KEY = '__serb-ppl-questions'

export const setQuestionsToLocalStorage = (questions: Questions) => {
	window?.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions))
	window?.dispatchEvent(new Event('storage'))

	return questions
}

export const getQuestionsFromLocalStorage = () => window?.localStorage.getItem(LOCAL_STORAGE_KEY)

export const getParsedQuestionsFromLocalStorage = () => {
	const questions = getQuestionsFromLocalStorage()

	if (!questions) return {}

	try {
		return JSON.parse(questions)
	} catch (error) {
		console.error('parsing error: ', error)
		return {}
	}
}

export const getQuestionFromLocalStorage = (id: string) => {
	return Object.values(getParsedQuestionsFromLocalStorage()).flat().find(q => q.id === id) || {}
}

export const saveQuestionToLocalStorage = (question: Question) => {
	const questions = getParsedQuestionsFromLocalStorage()

	questions[question.theme] = questions[question.theme].map(q => q.id === question.id ? question : q)

	window?.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions))
	window?.dispatchEvent(new Event('storage'))

	return questions
}
