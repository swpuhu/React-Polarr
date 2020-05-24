import React from 'react';
import ReactModal from "react-modal";
import {Home} from './view/Home';
import {Provider} from "./Context";

ReactModal.setAppElement(document.body);
function App() {
    return (
        <div className="App">
            <Provider>
                <Home/>
            </Provider>
        </div>

    );
}

export default App;
