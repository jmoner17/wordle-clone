/*
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
*/

const InputComponent = ({ bgColor, placeholder }) => (
  <input
    type="text"
    className={`bg-${bgColor}-500 placeholder-black dark:placeholder-white shadow-${bgColor}-500/50 text-center w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-xl sm:text-2xl md:text-3xl space-x-0 sm:space-x-1 md:space-x-2 shadow-lg rounded-md focus:outline-none`}
    style={{ caretColor: "transparent" }}
    placeholder={placeholder}
  />
);

const ServerComponent = async () => {
    //const data = await fetchData();
    //console.log(data);

    return(
      <div className="flex flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center h-auto w-auto mt-12 p-8">
        <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 md:space-x-2">
          <InputComponent bgColor="green" placeholder="W" readOnly/>
          <InputComponent bgColor="yellow" placeholder="O" readOnly/>
          <InputComponent bgColor="none" placeholder="R" readOnly/>
          <InputComponent bgColor="green" placeholder="D" readOnly/>
          <InputComponent bgColor="yellow" placeholder="L" readOnly/>
          <InputComponent bgColor="none" placeholder="E" readOnly/>
        </div>
        <div className="flex items-center justify-center text-2xl sm:text-3xl md:text-4x space-x-1 sm:space-x-1.5 md:space-x-2">
          <p>M</p>
          <p>A</p>
          <p>X</p>
          <p>X</p>
          <p>E</p>
          <p>R</p>
          <p>S</p>
        </div>
      </div>
    </div>
        
    );
};

export default ServerComponent;