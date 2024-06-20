<script lang="ts">
	import { writable, get } from "svelte/store";

	// Define types for criteria and options
	type Criterion = {
		name: string;
		weight: number;
	};

	type Option = {
		name: string;
	};

	// Stores for criteria and options
	const criteria = writable<Criterion[]>([]);
	const options = writable<Option[]>([]);
	const pairwiseComparisons = writable<number[][][]>([]);
	const results = writable<string[]>([]);

	// Functions to handle AHP logic
	function addCriterion() {
		criteria.update(c => [...c, { name: "", weight: 1 }]);
		updatePairwiseComparisons();
	}

	function addOption() {
		options.update(o => [...o, { name: "" }]);
		updatePairwiseComparisons();
	}

	function updatePairwiseComparisons() {
		const criteriaValues = get(criteria);
		const optionsValues = get(options);

		let comparisons: number[][][] = [];
		for (let i = 0; i < criteriaValues.length; i++) {
			comparisons.push([]);
			for (let j = 0; j < optionsValues.length; j++) {
				comparisons[i].push(new Array(optionsValues.length).fill(1));
			}
		}
		pairwiseComparisons.set(comparisons);
	}

	function normalizeMatrix(matrix: number[][]): number[][] {
		const columnSums = matrix[0].map((_, colIndex) =>
			matrix.reduce((sum, row) => sum + row[colIndex], 0)
		);

		return matrix.map(row =>
			row.map((value, colIndex) => value / columnSums[colIndex])
		);
	}

	function calculatePriorityVector(matrix: number[][]): number[] {
		const rowAverages = matrix.map(row =>
			row.reduce((sum, value) => sum + value, 0) / row.length
		);
		return rowAverages;
	}

	function calculateAHP() {
		const criteriaValues = get(criteria);
		const comparisons = get(pairwiseComparisons);

		// Normalize criteria comparison matrix and calculate criteria priority vector
		const criteriaMatrix = criteriaValues.map(c => c.weight);
		const normalizedCriteriaMatrix = normalizeMatrix([criteriaMatrix]);
		const criteriaPriorityVector = calculatePriorityVector(normalizedCriteriaMatrix);

		// Normalize each option comparison matrix and calculate option priority vectors
		const optionPriorityVectors = comparisons.map(matrix => {
			const normalizedMatrix = normalizeMatrix(matrix);
			return calculatePriorityVector(normalizedMatrix);
		});

		// Calculate final scores for each option
		const finalScores = get(options).map((_, optionIndex) => {
			return optionPriorityVectors.reduce((score, vector, criteriaIndex) => {
				return score + vector[optionIndex] * criteriaPriorityVector[criteriaIndex];
			}, 0);
		});

		// Determine the best option
		const bestOptionIndex = finalScores.indexOf(Math.max(...finalScores));
		const bestOption = get(options)[bestOptionIndex].name;

		results.set([`Best option is: ${bestOption}`]);
	}

	function updateComparisonValue(criteriaIndex: number, rowIndex: number, columnIndex: number, event: Event) {
		const input = event.target as HTMLInputElement;
		const value = parseFloat(input.value);
		pairwiseComparisons.update(pc => {
			const newPc = [...pc];
			newPc[criteriaIndex][rowIndex][columnIndex] = value;
			return newPc;
		});
	}
</script>

<section>
	<h1>AHP Calculator</h1>
	<div>
		<h2>Criteria</h2>
		{#each $criteria as criterion, index}
			<div>
				<input type="text" bind:value={criterion.name} placeholder="Criterion Name" />
				<input type="number" bind:value={criterion.weight} min="1" max="9" placeholder="Weight" />
			</div>
		{/each}
		<button on:click={addCriterion}>Add Criterion</button>
	</div>

	<div>
		<h2>Options</h2>
		{#each $options as option, index}
			<div>
				<input type="text" bind:value={option.name} placeholder="Option Name" />
			</div>
		{/each}
		<button on:click={addOption}>Add Option</button>
	</div>

	<div>
		<h2>Pairwise Comparisons</h2>
		{#each $pairwiseComparisons as comparisons, criteriaIndex}
			<div>
				<h3>{criteriaIndex + 1}. {$criteria[criteriaIndex].name}</h3>
				{#each comparisons as row, rowIndex}
					{#each row as value, columnIndex}
						<div>
							<label>{$options[rowIndex].name} vs {$options[columnIndex].name}</label>
							<input type="number" bind:value={value} min="1" max="9" on:input={(e) => updateComparisonValue(criteriaIndex, rowIndex, columnIndex, e)} />
						</div>
					{/each}
				{/each}
			</div>
		{/each}
	</div>

	<button on:click={calculateAHP}>Calculate</button>

	<div>
		<h2>Results</h2>
		<ul>
			{#each $results as result}
				<li>{result}</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	section {
		padding: 20px;
	}

	h1, h2 {
		text-align: center;
	}

	div {
		margin-bottom: 20px;
	}

	input[type="text"], input[type="number"] {
		margin: 5px;
		padding: 5px;
	}

	button {
		display: block;
		margin: 10px auto;
		padding: 10px 20px;
		background-color: #007BFF;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}

	ul {
		list-style-type: none;
		padding: 0;
	}

	li {
		padding: 5px 0;
	}
</style>
