import { criteriaStore } from '../../../../../store/criteriaStore';

export const load = async ({ fetch, params }) => {
  const fetchUrl = `/api/premium-decisions/${params.id}`;
  console.log('Fetch URL:', fetchUrl);  // Debug log

  try {
    const response = await fetch(fetchUrl);
    console.log('Fetch response status:', response.status);  // Debug log

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching data:', errorData.error);
      throw new Error(errorData.error || 'Data not found');
    }

    const data = await response.json();
    console.log('API Response:', data);  // Debug log

    const criteriaMatrix = Array(data.criteria.length).fill(null).map(() => Array(data.criteria.length).fill(0));
    const choicesComparisons = Array(data.criteria.length)
      .fill(null)
      .map(() =>
        Array(data.choices.length)
          .fill(null)
          .map(() => Array(data.choices.length).fill(null))
      );

    criteriaStore.set({ 
      ...data, 
      criteriaMatrix,
      choicesComparisons
    });

    return { props: data };
  } catch (error) {
    console.error('Error in load function:', error);
    return { error: 'Error fetching data' };
  }
};