import "./Overlay.css";

const Overlay = ({ onClick, className }) => {
    return <div className={`overlay_back ${className}`} onClick={onClick}></div>;
};

export default Overlay;
