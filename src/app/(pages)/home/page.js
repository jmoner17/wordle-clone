import ClientComponent  from "./ClientRender";
import LogoComponent from "./logo";

export default function  Home () {
    return (
      <div>
        <ClientComponent>
          <LogoComponent />
        </ClientComponent>
      </div>
    );
};