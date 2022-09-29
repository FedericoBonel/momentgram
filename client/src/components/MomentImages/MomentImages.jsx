import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./MomentImages.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentImages = ({ images, imgClass, containerClass, sliderClass, afterSliding }) => {
    let renderedImages;
    if (images.length === 1) {
        renderedImages = (
            <img
                className={imgClass}
                src={`${images[0].url.startsWith("/") ? BACKEND_URL : ""}${
                    images[0].url
                }`}
                alt="moment-img"
            />
        );
    } else if (images.length > 1) {
        renderedImages = images.map((image) => (
            <div
                className={`momentimage_container ${containerClass}`}
                key={image._id}
            >
                <img
                    className={imgClass}
                    src={`${image.url.startsWith("/") ? BACKEND_URL : ""}${
                        image.url
                    }`}
                    alt="moment-img"
                />
            </div>
        ));

        renderedImages = (
            <Slider
                dots
                customPaging={() => <div className="page"></div>}
                appendDots={(dots) => <ul>{dots}</ul>}
                dotsClass="dots"
                className={sliderClass}
                afterChange={afterSliding ? (current) => afterSliding(current) : undefined}
            >
                {renderedImages}
            </Slider>
        );
    } else {
        const image = images.url
            ? `${images.url.startsWith("/") ? BACKEND_URL : ""}${images.url}`
            : `${BACKEND_URL}/images/no-image.jpg`;

        renderedImages = (
            <img className={imgClass} src={image} alt="moment-img" />
        );
    }
    return renderedImages;
};

export default MomentImages;
