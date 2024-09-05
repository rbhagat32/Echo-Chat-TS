import Routing from "./utils/Routing";
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
      <Toaster richColors position="top-center" duration={1500} />
      <Routing />
    </>
  );
};

export default App;
