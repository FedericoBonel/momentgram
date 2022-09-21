import { useEffect } from "react";

const OutsideClickListener = (ref, callback) => {
    // Gets executed every time the reference changes
    useEffect(() => {

        // Check if the click made on the page
        // was outside of the current reference and call the callback if so
        const handleEvent = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        }

        // Attach the event handler to the event listener
        document.addEventListener("mousedown", handleEvent);

        // Detach the listener to avoid memory leaks
        return () => {
            document.removeEventListener("mousedown", handleEvent)
        }
    }, [ref, callback]);
};

export default OutsideClickListener;
