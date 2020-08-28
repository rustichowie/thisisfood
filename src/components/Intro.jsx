import React from "react";
import { useState } from "react";

function Intro({ initSettings, foodTypes }) {
  const [settings, setSettings] = useState([]);

  const days = [
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lørdag",
    "Søndag",
  ];

  return (
    <div className="column intro">
      {foodTypes.map((type) => {
        return (
          <div className="field" key={type.key}>
            <div className="control">
              <img src="" alt="bilde" />
              <label>{type.name}</label>
              <div className="field">
                <div className="control">
                  {days.map((value, index) => {
                    return (
                      <label class="checkbox">
                        <input type="checkbox" value={index} />
                        {value}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Intro;
