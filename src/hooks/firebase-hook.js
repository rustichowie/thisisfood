import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/firestore";
import { useState, useEffect } from "react";
import { getWeek, getYear } from "date-fns";
import { id } from "date-fns/locale";
import { generateCategories } from "../lib/categories";
import firebaseConfig from "../firebase-config.json";
console.log(firebaseConfig);
firebase.initializeApp(firebaseConfig);
const currentPlanSettings = {
  meals: [
    {
      key: "fish",
      //types: ["Middagsrett"],
      //categories: ["Fisk og sjømat"],
      min: 2,
      max: 2,
      days: [1, 1, 1, 1, 0, 0, 1],
    },
    {
      key: "veggie",
      //types: ["Vegetar"],
      //categories: [],
      min: 1,
      max: 1,
      days: [1, 0, 0, 0, 0, 0, 0],
    },
    {
      key: "poultry",
      //types: ["Middagsrett"],
      //categories: ["Kylling og høns", "Egg", "Kalkun, and og gås"],
      min: 1,
      max: 3,
      days: [1, 1, 1, 1, 1, 0, 1],
    },
    {
      key: "meat",
      //types: ["Middagsrett"],
      //categories: ["Svin", "Lam og kje", "Storfe", "Reinsdyrkjøtt"],
      min: 1,
      max: 3,
      days: [1, 1, 1, 1, 1, 1, 1],
    },
  ],
  cookOptions: {
    weekdays: {
      maxPrepTime: 40,
    },
    weekends: {
      maxPrepTime: 240,
    },
  },
};

const db = firebase.firestore();

export function useWeeklyPlan(userId) {
  const [weekPlan, setWeekPlan] = useState([]);

  useEffect(() => {
    const fetchPlan = async () => {
      const result = await db
        .collection("weekplan")
        .doc(`${getYear(new Date())}-${getWeek(new Date())}`)
        .get();

      const data = result.data();

      if (!data) {
        //TODO: Consider previous week.
        const settings = await db.collection("settings").doc(userId).get();

        if (settings.data()) {
          const mealPlan = generateCategories(settings.data().meals);
          if (mealPlan) {
            const saveResult = await db
              .collection("weekplan")
              .doc(`${getYear(new Date())}-${getWeek(new Date())}`)
              .set({
                week: mealPlan,
                meta: { text: "Add some metadata here" },
              });
            //TODO: Generate plan here
            setWeekPlan(mealPlan);
          }
        }
      } else {
        setWeekPlan(data);
      }
    };
    fetchPlan();
  }, [userId]);
  return [weekPlan, setWeekPlan];
}

export function useSettings(userId) {
  const [settings, setSettings] = useState({ meals: [] });
  useEffect(() => {
    const fetchSettings = async () => {
      const result = await db.collection("settings").doc(userId).get();

      const data = result.data();
      setSettings(data);
    };
    fetchSettings();
  }, [userId]);
  return [settings, setSettings];
}
