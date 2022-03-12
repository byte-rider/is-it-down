import styles from './Nav.module.css'
import CSIROSVG from '../SVGs/CSIROSVG';
import { AboutModalContext } from '../About/AboutModalContext';
import { useContext } from 'react';


const Nav = () => {
    const modalContext = useContext(AboutModalContext);
    return (
        <div className={styles.container}>
            <CSIROSVG />
            <div onClick={() => modalContext.modalOpen()}>ABOUT</div>
        </div>
    )
}

export default Nav;