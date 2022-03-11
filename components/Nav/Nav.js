import styles from './Nav.module.css'
import CSIROSVG from '../SVGs/CSIROSVG';

const Nav = () => {
    return (
        <div className={styles.container}>
            <CSIROSVG />
            <p>IS IT DOWN?</p>
            <div>ABOUT</div>
        </div>
    )
}

export default Nav;