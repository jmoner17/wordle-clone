import ClientComponent  from "./ClientRendering";
import ServerComponent from "./ServerRendering";

export default function  Gamba () {
    return (
      <div>
        <ClientComponent>
          <ServerComponent/>
        </ClientComponent>
      </div>
    );
};