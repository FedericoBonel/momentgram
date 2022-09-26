const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentImages = ({ images, className }) => {
    // Check if there are multiple images
    const renderedImages = images.length ? (
        images.map((image) => (
            <img
                className={className}
                src={`${BACKEND_URL}${image.url}`}
                alt="moment-img"
            />
        ))
    ) : (
        // Check if there is a single image or no image at all
        <img
            className={className}
            src={`${BACKEND_URL}${
                images.url ? images.url : "/images/no-image.jpg"
            }`}
            alt="moment-img"
        />
    );
    // TODO change this when implementing carousel to return the whole list
    return <>{renderedImages.length ? renderedImages[0] : renderedImages}</>;
};

export default MomentImages;
