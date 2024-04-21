import {useState} from 'react'
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
import {fisherShuffle, generateQuestions} from './utils'
import {
	setQuestionsToLocalStorage,
	saveQuestionToLocalStorage,
	getParsedQuestionsFromLocalStorage
} from './storage'
import {
	JSONType,
	Question,
	Questions
} from './types'
import './App.css'

const params = (obj: Record<string, JSONType>) => Object.entries(obj)[0]

const shuffleQuestions = (questions: Question) => fisherShuffle(questions)

const shuffleAndLimitQuestions = (questions: Questions, limit: number) =>
	Object.values(questions).map(fisherShuffle).map(q => q.slice(0, limit))

// if i'd ever need to filter questions with images
// const mergeQuestions = (questions: ReturnType<typeof shuffleQuestions>) => questions.flat().filter(q => q.image)
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
	const storageQuestions = getParsedQuestionsFromLocalStorage()

	if (storageQuestions) return storageQuestions

	return getAllQuestions()
}

export const App = () => {
	const [rawQuestions] = useState(getQuestions())
	const [quizQuestions, setQuizQuestions] = useState<Question[] | null>(null)
	const [isStarted, setIsStarted] = useState(false)
	const [shuffleVariants, setShuffleVariants] = useState(false)
	const [, setHighlight] = useState(false)

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
		<div className='app'>
			<div className='app__content'>
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
