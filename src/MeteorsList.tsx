import {Meteor} from "./App";
import {MeteorListItem} from "./MeteorListItem";
import React, {ChangeEvent, useEffect, useState} from "react";
import styles from "./MeteorsList.module.css"
import {useSearchDebounce} from "./SearchDebounce";

type MeteorsListProps = {
  meteors: Meteor[];
}

const ALL_YEARS = -1;

export const MeteorsList = ({meteors}: MeteorsListProps) => {
  const [years, setYears] = useState(new Set<number>());
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS);
  const [mass, setMass] = useState<number | null>(null);
  const debouncedMass = useSearchDebounce<number | null>(mass, 1000);

  useEffect(() => {
    let validYears = meteors.filter((m) => !isNaN(m.year)).map((m) => m.year);
    setYears(new Set(validYears));
  }, [meteors]);

  const selectYear = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
    setMass(null);
  };

  const massChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMass(Number(event.target.value));
  };

  let meteorsToDisplay = meteors;

  if (selectedYear !== ALL_YEARS) {
    meteorsToDisplay = meteorsToDisplay.filter((meteor) => {
      return (meteor.year === selectedYear) && ((debouncedMass !== null && meteor.mass > debouncedMass) || debouncedMass == null);
    });
  }

  let displayWarning = false;

  if (meteorsToDisplay.length === 0 && debouncedMass !== null) {

    displayWarning = true;

    setTimeout(() => {
      displayWarning = false;
      let matchingMeteor = meteors.find((m) => m.mass > debouncedMass);
      if (matchingMeteor) {
        setSelectedYear(matchingMeteor.year);
      }
    }, 1000)
  }

  let meteorItems = meteorsToDisplay.map((meteor) =>
    <MeteorListItem key={meteor.id} name={meteor.name} mass={meteor.mass} year={meteor.year}/>);

  let canFilterByMass = selectedYear !== ALL_YEARS;
  let massInputPlaceholder = canFilterByMass ? 'Please enter mass to filter' : 'Please select a year in order to filter by mass';

  return (
    <div>
      <select value={Number(selectedYear)} onChange={selectYear}>
        <option key={-1} value={-1}>View All</option>
        {Array.from(years).map((year: number) =>
          <option key={year} value={Number(year)}>{year}</option>
        )}
      </select>
      <input value={mass ? mass : ''} disabled={!canFilterByMass} type={'text'} placeholder={massInputPlaceholder}
             onChange={massChange}/>
      {meteorsToDisplay.length}
      {displayWarning ?
        <div>the mass was not found, jumping to first-year where there is a mass that fits the criteria</div> : ''}
      <div className={styles.meteorsList}>
        {meteorItems}
      </div>
    </div>)
};