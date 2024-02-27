const InputComponent = ({ bgColor, placeholder }) => (
  <input
    type="text"
    className={`bg-${bgColor}-500 placeholder-black dark:placeholder-white shadow-${bgColor}-500/50 text-center 
      md:w-7 lg:w-9 xl:w-12
      md:h-7 lg:h-9 xl:h-12
      md:text-lg lg:text-xl xl:text-3xl
      shadow-lg rounded-md focus:outline-none`}
    style={{ caretColor: "transparent" }}
    placeholder={placeholder}
  />
);
//!Test does not adjust for resolution space proportionally with other elements.
const ServerComponent = async () => {


  return (
    <div className=" flex-col items-center justify-center hidden md:block">
      <div className="container flex flex-col items-center justify-center h-auto w-auto mt-12 p-7">
        <div className="flex items-center justify-center md:space-x-1 lg:space-x-1 xl:space-x-2">
          <InputComponent bgColor="green" placeholder="W" readOnly />
          <InputComponent bgColor="yellow" placeholder="O" readOnly />
          <InputComponent bgColor="none" placeholder="R" readOnly />
          <InputComponent bgColor="green" placeholder="D" readOnly />
          <InputComponent bgColor="yellow" placeholder="L" readOnly />
          <InputComponent bgColor="none" placeholder="E" readOnly />
        </div>
        <div className="flex items-center justify-center 
          md:text-lg lg:text-2xl xl:test-3xl
          space-x-1 sm:space-x-1.5 md:space-x-2 lg:space-x-2 xl:space-x-2">
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