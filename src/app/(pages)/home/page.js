import ClientComponent  from "./ClientRendering";
import ServerComponent from "./ServerRendering";

export default function  Home () {
    return (
      <div>
        <ClientComponent>
          <ServerComponent />
        </ClientComponent>
      </div>
    );
};
  