import { useEffect } from "react";

const Popup = ({ isOpen, name, onClose, children }) => {

    useEffect(() => {
        if (!isOpen) return;

        const closeByEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('keydown', closeByEscape)

        return () => document.removeEventListener('keydown', closeByEscape)
    }, [isOpen, onClose])

    const handleOverlay = (e) => {
        if (e.target === e.currentTarget) {
            // клик по оверлею
            if (e.target.classList.contains('popup_opened')) {
                onClose();
            }
        }
    }

    return (
        <div className={`popup ${isOpen ? "popup_opened" : ""} popup_type_${name}`} onMouseDown={handleOverlay}>
            <div className='popup__container'>
                {children}
                <button className='popup__close' type='button' onClick={onClose}/>
            </div>
        </div>
    );
};

export default Popup;