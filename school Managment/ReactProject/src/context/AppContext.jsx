import { createContext } from "react"
import { baseURL } from "../utils/config";


export const AppContext = createContext();

const ContextProvider = (props) => {
    return (
        <AppContext.Provider value={{ baseURL }}>
            {props.children}
        </AppContext.Provider>
    );
}

export default ContextProvider;