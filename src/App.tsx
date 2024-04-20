import {useState, useEffect} from 'react'
import {Stats} from './components/Stats'
import {Configuration} from './components/Configuration'
import {Quiz} from './components/Quiz'
import air_law from './questions/1.air_law.json'
import general_knowledge from './questions/2.aircraft_general_knowledge.json'
import flight_planning from './questions/3.flight_planning_and_monitoring.json'
import human_performance from './questions/4.human_performance.json'
import meteorology from './questions/5.meteorology.json'
import navigation from './questions/6.navigation.json'
import procedures from './questions/7.procedures.json'
import principles_of_flight from './questions/8.principles_of_flight.json'
import communications from './questions/9.communications.json'
import {fisherShuffle} from './utils'
const LOCAL_STORAGE_KEY = '__serb-ppl-questions'
const THEME_EVENT = '__serbtheme'

type JSON = Record<string, {
	title: string
	variants: Record<string, string>
}>

type GenerateProps = [string, JSON]

const params = (obj: Record<string, JSON>) => Object.entries(obj)[0]

const generateQuestions = ([theme, json]: GenerateProps) => Object.entries(json)
	.map(([key, value]) => ({
		id:`${theme}${key}`,
		theme,
		...value,
		correctAnswer: value.variants[Object.keys(value.variants)[0]],
		seen: 0,
		correctAnswers: 0,
		incorrectAnswers: 0,
	}))

type Question = ReturnType<typeof generateQuestions>;
type Questions = Record<string, Question>

const setQuestionsToLocalStorage = (questions: Questions) => {
	window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions))
	window.dispatchEvent(new Event('storage'))

	return questions
}

const getQuestionFromLocalStorage = (id: string) => {
	const questions = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY))

	return Object.values(questions).flat().find(q => q.id === id)
}

const saveQuestionToLocalStorage = (question: Question) => {
	const questions = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY))

	questions[question.theme] = questions[question.theme].map(q => q.id === question.id ? question : q)

	window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions))
	window.dispatchEvent(new Event('storage'))

	return questions
}

const shuffleQuestions = (questions: Question) => fisherShuffle(questions)

const shuffleAndLimitQuestions = (questions: Questions, limit: number) =>
	Object.values(questions).map(fisherShuffle).map(q => q.slice(0, limit))

const mergeQuestions = (questions: ReturnType<typeof shuffleQuestions>) => questions.flat()

const getAllQuestions = () => {
	const allQuestions: Questions = {
		air_law: generateQuestions(params({air_law})),
		general_knowledge: generateQuestions(params({general_knowledge})),
		flight_planning: generateQuestions(params({flight_planning})),
		human_performance: generateQuestions(params({human_performance})),
		meteorology: generateQuestions(params({meteorology})),
		navigation: generateQuestions(params({navigation})),
		procedures: generateQuestions(params({procedures})),
		principles_of_flight: generateQuestions(params({principles_of_flight})),
		communications: generateQuestions(params({communications})),
	}

	return setQuestionsToLocalStorage(allQuestions)
}

const getQuestions = () => {
	const storageQuestions = window?.localStorage.getItem(LOCAL_STORAGE_KEY)

	if (storageQuestions) return JSON.parse(storageQuestions)

	return getAllQuestions()
}

const result = () => {
	console.time('result')
	const t = shuffleAndLimitQuestions(getQuestions(), 5)
	const q = mergeQuestions(t);
	console.timeEnd('result')

	return q
}

export const App = () => {
	const [rawQuestions] = useState(getQuestions())
	const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null)
	const [isStarted, setIsStarted] = useState(false)
	const [shuffleVariants, setShuffleVariants] = useState(false)
	const [highlight, setHighlight] = useState(false)

	const onLog = (question: Question) => saveQuestionToLocalStorage(question)
	const onReset = getAllQuestions

	const onConfigurationSubmit = ({highlight, limit, shuffleQuestions, shuffleVariants}: any) => {
		const questions = shuffleQuestions
			? shuffleAndLimitQuestions(rawQuestions, limit)
			: Object.values(rawQuestions).map(q => q.slice(0, limit))

		setQuizQuestions(mergeQuestions(questions))
		setShuffleVariants(shuffleVariants)
		setHighlight(highlight)
		setIsStarted(true)
	}

	return (
		<div style={{display: 'flex', gap: '40px'}}>
			<div style={{width: '60vw', justifyContent: 'center', display: 'flex', paddingTop: '10%'}}>
				{!isStarted && <Configuration
					onSubmit={onConfigurationSubmit}
					onReset={onReset}
				/>}
				<Quiz
					questions={quizQuestions}
					shuffle={shuffleVariants}
					highlight={false}
					onLog={onLog}
				/>
			</div>
			<Stats rawQuestions={rawQuestions} />
		</div>
	)
}
