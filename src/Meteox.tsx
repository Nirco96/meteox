import React, {ChangeEvent, useEffect, useState} from 'react';
import {MeteorsList} from "./MeteorsList";
import './Meteox.css';
import {useDebounceValue} from "./UseDebounce";

const DATA_URL = `https://data.nasa.gov/resource/y77d-th95.json`;
const MASS_ERROR = `No result, jumping to first-year that fits the criteria`;
const ALL_YEARS = -1;

export type Meteor = {
  id: string,
  name: string,
  mass: number,
  year: number
}

const filterMeteors = (meteors: Meteor[], year: number, mass: number | null) => {
  if (year === ALL_YEARS) {
    return meteors;
  }

  return meteors ? meteors.filter((m) => m.year === year && (!mass || m.mass >= mass)) : [];
}

const findNextYearForMass = (meteors: Meteor[], mass: number) => {
  let matchingMeteor = meteors.find((m) => m.mass >= mass);
  return matchingMeteor ? matchingMeteor.year : ALL_YEARS;
}

function Meteox() {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(-1);
  const [mass, setMass] = useState<number | null>(null);
  const debouncedMass = useDebounceValue<number | null>(mass, 800);

  // Since this is the only place we fetch, I did not wrap this logic in a reusable object or move it
  // to a more generic place
  useEffect(() => {
    fetch(DATA_URL).then((res: Response) => res.json()).then((meteorsJson) => {
      setMeteors(meteorsJson.map((meteorJson: { name: string, id: string, mass: string, year: string }) => {
        return {...meteorJson, year: new Date(meteorJson.year).getFullYear(), mass: Number(meteorJson.mass)};
      }));
    }).catch(reason => console.log('Could not load meteors!'));
  }, []);

  useEffect(() => {
    if(selectedYear === ALL_YEARS && mass) {
      setMass(null);
    }
  }, [selectedYear, mass])

  let yearsSet: Set<number> = new Set(meteors?.map((m: Meteor) => m.year));

  const selectYear = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  const massChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMass(Number(event.target.value));
  }

  let filteredMeteors = filterMeteors(meteors, selectedYear, debouncedMass);

  if (filteredMeteors.length === 0 && debouncedMass) {
      setTimeout(() => {
        setSelectedYear(findNextYearForMass(meteors, debouncedMass));
      }, 1000);
  }

  return (
    <div className="container">
      <div className="header">
        <Logo/>
        <div className="headerDetails">
          <div className="spaced">
            <YearSelector value={selectedYear} years={yearsSet} onChange={selectYear}/>
          </div>
          <div className="spaced">
            <MassFilter value={mass} disabled={selectedYear === ALL_YEARS} onChange={massChange}
                        placeholder={selectedYear === ALL_YEARS ? 'Select a year first' : 'Enter mass'}/>
          </div>
          <MeteorCounter counter={filteredMeteors.length}/>

          {filteredMeteors.length === 0 && debouncedMass ?
            <p className="massWarning">{MASS_ERROR}</p> : ''}
        </div>
      </div>
      {meteors.length > 0 ? <MeteorsList meteors={filteredMeteors}></MeteorsList> : 'Loading...'}
    </div>
  );
}

export default Meteox;

export const Logo = () => {
  return (
    <h1>Welcome to <span className="appName">Meteox</span></h1>
  )
}

type YearSelectorProps = {
  value: number,
  years: Set<number>,
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}

export const YearSelector = ({value, years, onChange}: YearSelectorProps) => {
  return (
    <React.Fragment>
      <label className="yearSelectLabel">Show meteors from: </label>
      <select value={Number(value)} onChange={onChange}>
        <option key={ALL_YEARS} value={ALL_YEARS}>All Years</option>
        {Array.from(years).map((year: number) => !isNaN(year) ?
          <option key={year} value={year}>{year}</option> : ''
        )}
      </select>
    </React.Fragment>
  )
}

type MassFilterProps = {
  value: number | null,
  disabled: boolean,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string,
}

export const MassFilter = ({value, disabled, onChange, placeholder}: MassFilterProps) => {
  return (
    <React.Fragment>
      <label className="yearSelectLabel">With mass larger than: </label>
      <input value={value ? value : ''} disabled={disabled} type='text' onChange={onChange} placeholder={placeholder}/>
    </React.Fragment>)
}

type MeteorCounterProps = {
  counter: number
}

const MeteorCounter = ({counter}: MeteorCounterProps) => {
  return <div className="">Showing {counter} meteors</div>;
}