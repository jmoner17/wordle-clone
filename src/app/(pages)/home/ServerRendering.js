
const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/server');
      const data = await response.json();
      console.log('Received uppercase word:', data.data);
      // Assuming you have a state variable named 'target'
      setTarget(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
};

const ServerComponent = async () => {
    const data = await fetchData();
    console.log(data);

    return(
        <div>
        </div>
    );
};

export default ServerComponent;