import {FC} from 'react'
import {
	Button,
	FormControl,
	FormLabel,
	FormControlLabel,
	FormHelperText,
	RadioGroup,
	Radio,
} from '@mui/material'

interface VariantsProps {
	data: Record<string, string>
	onSelect: (value: string) => () => void
}

export const Variants: FC<VariantsProps> = ({data, onSelect}) => {
	// return (
	// 	<ul>
	// 		{Object.entries(data).map(([key, value]) => (
	// 			<li key={key} onClick={onSelect(value)}>{value}</li>
	// 		))}
	// 	</ul>
	// );

	return (
		<form onSubmit="">
      <FormControl sx={{ m: 3 }} error="" variant="standard">
        <FormLabel id="demo-error-radios">Pop quiz: MUI is...</FormLabel>
        <RadioGroup
          aria-labelledby="error-radios"
          name="quiz"
          // value={value}
          // onChange={handleRadioChange}
        >
          <FormControlLabel value="best" control={<Radio />} label="The best!" />
          <FormControlLabel value="worst" control={<Radio />} label="The worst." />
        </RadioGroup>
        <FormHelperText>helperText</FormHelperText>
        <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
          Check Answer
        </Button>
      </FormControl>
    </form>
	)
};
