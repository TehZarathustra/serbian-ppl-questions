import {generateQuestions} from './utils'

export type JSONType = Record<string, {
	title: string
	variants: Record<string, string>
}>

export type Question = ReturnType<typeof generateQuestions>
export type Questions = Record<string, Question>
