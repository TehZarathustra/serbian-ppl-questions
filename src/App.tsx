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

type JSON = Record<string, {
	title: string
	variants: Record<string, string>
}>

type GenerateProps = [string, JSON]

const params = (obj: Record<string, JSON>) => Object.entries(obj)[0]

const generateQuestions = ([theme, json]: GenerateProps) => Object.entries(json)
	.map(([key, value]) => ({
		id:`${key}${theme}`,
		theme,
		...value
	}))
	.slice(0, 2)

const questions = [
	...generateQuestions(params({air_law})),
	...generateQuestions(params({general_knowledge})),
	...generateQuestions(params({flight_planning})),
	...generateQuestions(params({human_performance})),
	...generateQuestions(params({meteorology})),
	...generateQuestions(params({navigation})),
	...generateQuestions(params({procedures})),
	...generateQuestions(params({principles_of_flight})),
	...generateQuestions(params({communications})),
]

export const App = () => {
	return (
		<>
			<Stats />
			<Configuration />
			<Quiz data={questions} />
		</>
	)
}
