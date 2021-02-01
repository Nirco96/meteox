import React, {ChangeEvent, useEffect, useState} from 'react';
import {MeteorsList} from "./MeteorsList";
import './Meteox.css';
import {useDebounceValue} from "./UseDebounce";
import {
  ALL_YEARS,
  filterMeteors,
  findNextYearForMass,
  MASS_ERROR,
  Meteor,
  NO_RESULTS_DELAY,
  useFetchMeteors
} from "./Meteox.util";
import {MassFilter, MeteorCounter, YearSelector} from "./MeteorFilters";

export const Logo = () => {
  return (
    <h1>Welcome to <span className="appName">Meteox</span></h1>
  )
}

function Meteox() {
  const meteors = useFetchMeteors();
  const [filteredMeteors, setFilteredMeteors] = useState<Meteor[]>(meteors);
  const [selectedYear, setSelectedYear] = useState<number>(ALL_YEARS);
  const [mass, setMass] = useState<number | null>(null);
  const [warning, setWarning] = useState('')
  const debouncedMass = useDebounceValue<number | null>(mass, 800);

  useEffect(() => {
    if (meteors.length > 0) {
      setWarning('');
    } else {
      setWarning('Loading meteors...');
    }
  }, [meteors])

  useEffect(() => {
    const jumpToNextYearAndResetWarning = (delay: number) => {
      setTimeout(() => {
        setSelectedYear(findNextYearForMass(meteors, debouncedMass));
        setWarning('');
      }, delay);
    };

    if (selectedYear === ALL_YEARS && mass) {
      setMass(null);
    } else if (meteors.length > 0) {
      let filtered = filterMeteors(meteors, selectedYear, debouncedMass);
      setFilteredMeteors(filtered);

      if (filtered.length === 0) {
        setWarning(MASS_ERROR);
        jumpToNextYearAndResetWarning(NO_RESULTS_DELAY);
      }
    }
  }, [selectedYear, debouncedMass, meteors, mass])

  let yearsSet: Set<number> = new Set(meteors?.map((m: Meteor) => m.year));

  const selectYear = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  const massChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMass(Number(event.target.value));
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
        </div>
      </div>
      {warning ? <p className="warning">{warning}</p> : <MeteorsList meteors={filteredMeteors}></MeteorsList>}
    </div>
  );
}

export default Meteox;
