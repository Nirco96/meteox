import {useEffect, useState} from "react";

export const DATA_URL = `https://data.nasa.gov/resource/y77d-th95.json`;
export const MASS_ERROR = `No result, jumping to first-year that fits the criteria`;
export const ALL_YEARS = -1;
export const NO_RESULTS_DELAY = 1000;

export type Meteor = {
  id: string,
  name: string,
  mass: number,
  year: number
}

export const useFetchMeteors = () => {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    fetch(DATA_URL).then((res: Response) => res.json()).then((meteorsJson) => {
      setMeteors(meteorsJson.map((meteorJson: { name: string, id: string, mass: string, year: string }) => {
        return {...meteorJson, year: new Date(meteorJson.year).getFullYear(), mass: Number(meteorJson.mass)};
      }));
    }).catch(reason => console.log('Could not load meteors!'));
  }, []);

  return meteors;
}

export const filterMeteors = (meteors: Meteor[], year: number, mass: number | null) => {
  if (year === ALL_YEARS) {
    return meteors;
  }

  return meteors ? meteors.filter((m) => m.year === year && (!mass || m.mass >= mass)) : [];
}

export const findNextYearForMass = (meteors: Meteor[], mass: number | null) => {
  let matchingMeteor = meteors.find((m) => mass && m.mass >= mass);
  return matchingMeteor ? matchingMeteor.year : ALL_YEARS;
}