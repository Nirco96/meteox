import React, {ChangeEvent} from "react";
import {ALL_YEARS} from "./Meteox.util";

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
      <input value={value ? value : ''} disabled={disabled} type="text" onChange={onChange} placeholder={placeholder}/>
    </React.Fragment>)
}

type MeteorCounterProps = {
  counter: number
}

export const MeteorCounter = ({counter}: MeteorCounterProps) => {
  return <div>Showing {counter} meteors</div>;
}