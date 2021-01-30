import styles from './MeteorListItem.module.css'
import meteorImg from "./comet-meteor.svg"

type MeteorListItemProps = {
  name: string,
  mass: number,
  year: number
}

export const MeteorListItem = ({name, mass, year}: MeteorListItemProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.img}>
        <img src={meteorImg} height={40} width={40} alt={''}/>
      </div>
      <div className={styles.details}>
        <div>
          <label>Name: </label><span>{name}</span>
        </div>
        <div>
          <label>Fell at: </label><span>{isNaN(year) ? 'unknown' : year}</span>
        </div>
        <div>
          <label>Mass: </label><span>{isNaN(mass) ? 'unknown': mass}</span>
        </div>
      </div>
    </div>
  )
};