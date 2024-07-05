import logo from "./logo.svg";
import "./App.css";
import Sudoku from "./components/sudoku/Sudoku";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

function App() {
  const h1Title = "Sudoku Solver";

  useGSAP(() => {
    gsap.from(".char", {
      y: -300,
      duration: 1,
      delay: 1,
      stagger: { each: 0.1 },
    });
  }, []);

  return (
    <>
      <header>
        <div style={{ display: "flex" }}>
          {h1Title.split("").map((char) => (
            <h1 key={"main-title"} className="char">
              {char === " " ? "\u00A0" : char}
            </h1>
          ))}
          {/* <h1 id="title-h1">Sudoku Resolver</h1> */}
        </div>
      </header>
      <div className="main">
        <Sudoku />
      </div>
    </>
  );
}

// function BtnResolve(){
//   return (
//     <button onClick={}> </button>
//   )
// }

export default App;
