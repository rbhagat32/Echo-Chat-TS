import Routing from "./utils/Routing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <ToastContainer
        toastStyle={{
          backgroundColor: "white",
          color: "black",
        }}
        stacked
        autoClose={4000}
      />
      <div className="w-full min-h-screen">
        <Routing />
      </div>
    </>
  );
}
