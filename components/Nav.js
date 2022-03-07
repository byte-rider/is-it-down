import styles from '../styles/Nav.module.css'
import csiroLogo from '../public/csiro.svg'

const Nav = () => {
    return (
        <div className={styles.container}>
            <section className={styles.left}>
                <object className={styles.logo} data="csiro.svg" type="image/svg+xml"></object>
            </section>
            <section className={styles.centre}>
                <p>Is it down?</p>
            </section>
            <section className={styles.right}>
                <div className="outline">About</div>
                <div className="outline">div2</div>
                <div className="outline">div3</div>
                <div className="outline">div4</div>
                <div className="outline">div5</div>
            </section>
        </div>
    )
}

export default Nav;