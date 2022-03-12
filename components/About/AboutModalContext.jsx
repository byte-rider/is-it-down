import {useState, useEffect, createContext} from "react";

export const AboutModalContext = createContext();

export const AboutModalProvider = (props) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const modalOpen = () => {setModalIsOpen(true)};
    const modalClose = () => {setModalIsOpen(false)};

    const value = {
        modalIsOpen, modalIsOpen,
        modalOpen: modalOpen,
        modalClose: modalClose,
    }

    return (
        <AboutModalContext.Provider value={value}>
            {props.children}
        </AboutModalContext.Provider>
    )
}