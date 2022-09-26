const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentImages = ({ images, className }) => {
    let renderedImages;
    if (images.length) {
        // Check if there are multiple images
        renderedImages = images.map((image) => (
            <img
                className={className}
                src={`${image.url.startsWith("/") ? BACKEND_URL : ""}${
                    image.url
                }`}
                alt="moment-img"
            />
        ));
    } else {
        // Check if there is a single image or no image at all
        // If there's a single image check it's domain, otherwise just assign the placeholder
        const image = images.url
            ? `${images.url.startsWith("/") ? BACKEND_URL : ""}${images.url}`
            : `${BACKEND_URL}/images/no-image.jpg`;

        renderedImages = (
            <img className={className} src={image} alt="moment-img" />
        );
    }

    // TODO change this when implementing carousel to return the whole list instead of [0]
    return <>{renderedImages.length ? renderedImages[0] : renderedImages}</>;
};

export default MomentImages;
