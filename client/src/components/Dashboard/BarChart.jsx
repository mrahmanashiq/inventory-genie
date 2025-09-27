import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Title,
	Tooltip,
} from 'chart.js';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTopSixProducts } from '../../hooks/useProducts';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

export const options = {
	indexAxis: 'y',
	elements: {
		bar: {
			borderWidth: 2,
		},
	},
	responsive: true,
	plugins: {
		legend: {
			position: 'right',
		},
		title: {
			display: true,
			text: 'Chart.js Horizontal Bar Chart',
		},
	},
};

// const labels = ["January", "February", "March", "April", "May", "June", "July"];

export function BarChart() {
	const [month, setMonth] = useState(4);

	const { data: apiData } = useTopSixProducts(month);

	const labels = apiData?.products?.map((product) => product?.name);
	const dataSets = apiData?.products?.map((product) => product?.quantity);

	console.log(apiData);

	const data = {
		labels,
		datasets: [
			{
				label: 'total sell:',
				data: dataSets,
				borderColor: 'rgb(53, 162, 235)',
				backgroundColor: 'rgba(53, 162, 235, 0.5)',
			},
		],
	};

	return <Bar options={options} data={data} />;
}
