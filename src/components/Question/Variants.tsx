import {FC} from 'react';

interface VariantsProps {
	data: Record<string, string>
	onSelect: (value: string) => () => void
}

export const Variants: FC<VariantsProps> = ({data, onSelect}) => {
	return (
		<ul>
			{Object.entries(data).map(([key, value]) => (
				<li key={key} onClick={onSelect(value)}>{value}</li>
			))}
		</ul>
	);
};
