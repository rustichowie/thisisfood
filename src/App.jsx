import React from "react";
import "./App.scss";
//import "bulma";
import { useWeeklyPlan, useSettings } from "./hooks/firebase-hook";
import Intro from "./components/Intro";

//TODO: Change this to be the current user
const userId = "32442432";

function App() {
  const [settings, setSettings] = useSettings(userId);
  const [weekPlan, setWeekPlan] = useWeeklyPlan(userId);

  const foods = [
    {
      key: "fish",
      name: "Fisk og Skalldyr",
    },
    {
      key: "meat",
      name: "Kjøtt",
    },
    {
      key: "poultry",
      name: "Kylling og sånt",
    },
    {
      key: "veggie",
      name: "Vegetar",
    },
  ];

  return (
    <div className="section">
      <div className="container">
        {!settings && (
          <Intro
            initSettings={(settings) => setSettings(settings)}
            foodTypes={foods}
          />
        )}
      </div>
    </div>
  );
}

export default App;
