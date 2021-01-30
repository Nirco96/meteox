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
          <label>Name:</label> {name}
        </div>
        <div>
          <label>Mass:</label> {mass}
        </div>
        <div>
          <label>Year:</label> {year}
        </div>
      </div>
    </div>
  )
};