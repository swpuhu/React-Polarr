import React from 'react';
import ReactDOM from 'react-dom';


type PropsType = {
    
}

class Modal extends React.Component {
    static modalRoot: HTMLElement = document.body;
    el: HTMLElement;
    constructor(props: React.Props<PropsType>) {
        super(props);
        this.el = document.createElement('div');
        this.el.classList.add('modal');
    }

    componentDidMount() {
        Modal.modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        Modal.modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el
        );
    }
}

export {Modal};