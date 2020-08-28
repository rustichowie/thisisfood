import { swap, getRandomElement } from "./array";
import { isValidSettings } from "./settings";

function getAlternatives(minWeek, settings) {
  let res = [];
  function permute(cats, min, max) {
    if (min === max && isValidMinWeek(cats, settings)) {
      res.push([...cats]);
    } else {
      for (let i = min; i <= max; i++) {
        if (cats[min] !== cats[i]) {
          cats = swap(cats, min, i);
          permute(cats, min + 1, max);
          cats = swap(cats, min, i);
        }
      }
    }
  }
  permute(minWeek, 0, minWeek.length - 1);
  return res;
}
function isValidMinWeek(week, settings) {
  for (let i = 0; i < week.length; i++) {
    if (week[i] === "-") {
      continue;
    }
    const currentCat = settings.find((s) => week[i] === s.key);
    if (
      currentCat.days[i] === 0 ||
      currentCat.max < week.filter((x) => x === currentCat.key).length
    ) {
      return false;
    }
  }
  return true;
}
function canPlaceCategory(week, day, category) {
  return (
    week.filter((x) => x === category.key).length < category.max &&
    category.days[day]
  );
}
function completeWeek(week, settings) {
  for (let i = 0; i < week.length; i++) {
    if (week[i] === "-") {
      const validCats = settings.filter((x) => canPlaceCategory(week, i, x));
      if (validCats.length === 0) {
        return null;
      }
      week[i] = getRandomElement(validCats).key;
    }
  }
  return week;
}
function distance(array = [], element) {
  if (array.filter((x) => x === element).length < 2) {
    return Math.floor(array.length / 2);
  }

  const indices = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) {
      indices.push(i);
    }
  }

  let lowestDist = indices[indices.length - 1] - indices[0];

  for (let i = 0; i < indices.length - 1; i++) {
    //Look forward & backwards
    lowestDist = Math.min(indices[i + 1] - indices[i], lowestDist);
  }

  return lowestDist;
}
function preFillWeek(settings) {
  const min = settings.reduce((minCats, cat) => {
    for (let i = 0; i < cat.min; i++) {
      minCats.push(cat.key);
    }
    return minCats;
  }, []);

  const left = 7 - min.length;

  for (let i = 0; i < left; i++) {
    min.push("-");
  }
  return min;
}
function getWeekDistance(week) {
  return week.reduce((aggr, el) => {
    aggr += distance(week, el);
    return aggr;
  }, 0);
}
function pickCategoryWeek(weeks) {
  //Pick items with score over 15
  const validWeeks = weeks.filter((x) => x !== null);
  validWeeks.sort((a, b) => a.score > b.score);
  const candidates = validWeeks.filter((week) => week.score >= 15);

  if (candidates.length === 0) {
    return validWeeks[0];
  }

  return getRandomElement(candidates);
}

export function generateCategories(settings) {
  if (!isValidSettings(settings)) {
    throw new Error("Settings are not valid");
  }
  console.log(settings);

  const minWeek = preFillWeek(settings);
  const weeks = getAlternatives(minWeek, settings);
  const completedWeeks = weeks.map((week) => {
    const res = completeWeek(week, settings);
    if (!res) {
      return null;
    }
    return {
      week: res,
      score: getWeekDistance(res),
    };
  });
  return pickCategoryWeek(completedWeeks);
}
