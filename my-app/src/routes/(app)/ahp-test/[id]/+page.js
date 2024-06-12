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
  
      return data;
    } catch (error) {
      console.error('Error in load function:', error);
      return { error: 'Error fetching data' };
    }
  };
  