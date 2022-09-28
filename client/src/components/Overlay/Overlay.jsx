import { useEffect } from "react";
import "./Overlay.css";

const Overlay = ({ onClick, className }) => {

    // Disables scrolling when rendering
    useEffect(() => {
        document.body.style.overflow = "hidden";

        // When overlay unmounts enable scrolling again
        return () => document.body.style.overflow = "auto";
    }, [])

    return <div className={`overlay_back ${className}`} onClick={onClick}></div>;
};

export default Overlay;
