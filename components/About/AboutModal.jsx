import styles from './AboutModal.module.css';
import { AboutModalContext } from './AboutModalContext';
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AboutModal = () => {
    const modalContext = useContext(AboutModalContext);
    const animationModal = {
        initial: {opacity: 0},
        animate: {opacity: 1},
        exit: {opacity: 0},
    }

    const animationContent = {
        initial: {opacity: 0, scale: 0},
        animate: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.3,
            },
        },
        exit: {opacity: 0}
    }

    return(
        <motion.div className={styles.backdrop} onClick={(e) => modalContext.modalClose()} {...animationModal}>
            <motion.div onClick={(e) => e.stopPropagation()} className={styles.modal} {...animationContent}>
                <h1>Is It Down?</h1>
                <p>Checks if something is down for everyone or just you. <br/>
                Enter a host (eg: confluence.csiro.au) and press enter.</p>
                <p>Suggestions, bugs or comments go to <a href="mailto:george.edwards@csiro.au">edw19b@csiro.au</a></p>
                <p>Built using React with Next.js<br/>
                -George <a href="tel:0419866631">0419866631</a></p>
            </motion.div>
        </motion.div>
    );
}

export default AboutModal;