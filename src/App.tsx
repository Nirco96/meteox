import React, {useEffect, useState} from 'react';
import {MeteorsList} from "./MeteorsList";
import './App.css';

const DATA_URL = `https://data.nasa.gov/resource/y77d-th95.json`;

export type Meteor = {
  id: string,
  name: string,
  mass: number,
  year: number
}

function App() {
  const [meteors, setMeteors] = useState<Meteor[] | null>(null);

  // Since this is the only place we fetch, I did not wrap this logic in a reusable object
  useEffect(() => {
    fetch(DATA_URL).then((res: Response) => res.json()).then((meteorsJson) => {
      setMeteors(meteorsJson.map((meteorJson: {name: string, id: string, mass: string, year: string}) => {
        return {...meteorJson, year: new Date(meteorJson.year).getFullYear(), mass: Number(meteorJson.mass)};
      }));
    }).catch(reason => console.log('Could not load meteors!'));
  }, []);

  return (
    <div className="App">
      {meteors ? <MeteorsList meteors={meteors}></MeteorsList> : 'Loading...'}
    </div>
  );
}

export default App;
