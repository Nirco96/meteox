import {Meteor} from "./Meteox";
import "./MeteorsList.css"
import React from "react";
import meteorImg from "./comet-meteor.svg";

type MeteorsListProps = {
  meteors: Meteor[];
}

export const MeteorsList = ({meteors}: MeteorsListProps) => {
  return (
    <div className="meteorsList">
      {meteors.map((meteor) =>
        <MeteorListItem key={meteor.id} name={meteor.name} mass={meteor.mass} year={meteor.year}/>)}
    </div>
  )
};


type MeteorListItemProps = {
  name: string,
  mass: number,
  year: number
}

export const MeteorListItem = ({name, mass, year}: MeteorListItemProps) => {
  return (
    <div className="card">
      <div className="img">
        <img src={meteorImg} height={40} width={40} alt={''}/>
      </div>
      <div className="details">
        <div>
          <label>Name: </label><span>{name}</span>
        </div>
        <div>
          <label>Fell at: </label><span>{isNaN(year) ? 'unknown' : year}</span>
        </div>
        <div>
          <label>Mass: </label><span>{isNaN(mass) ? 'unknown' : mass}</span>
        </div>
      </div>
    </div>
  )
};