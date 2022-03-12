import { useRef, useContext } from "react";
import { createContext } from "react/cjs/react.production.min";

export const SearchBarContext = createContext();

export const SearchBarProvider = (props) => {
    const inputHostReference = useRef();
    const inputProtocolReference = useRef();

    const value = {
        inputHostReference: inputHostReference,
        inputProtocolReference: inputProtocolReference,
    }

    return (
        <SearchBarContext.Provider value={value}>
            {props.children}
        </SearchBarContext.Provider>
    );
}