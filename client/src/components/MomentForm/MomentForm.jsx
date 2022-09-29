import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileAlt,
    faMapMarkerAlt,
    faSpinner,
    faPlus,
    faTrash
} from "@fortawesome/free-solid-svg-icons";

import "./MomentForm.css";
import {
    getMomentById,
    updateMoment,
    createMoment,
} from "../../api/MomentsApi";
import MomentImages from "../MomentImages/MomentImages";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MomentForm = ({ momentId, user }) => {
    const navigate = useNavigate();
    const fileInput = useRef(null);
    const [moment, setMoment] = useState({
        data: {
            description: "",
            location: "",
            img: [],
        },
        submitStatus: "loading",
    });
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const fetchMoment = async () => {
            if (!momentId) {
                setMoment((prevMoment) => ({
                    ...prevMoment,
                    submitStatus: "idle",
                }));
                return;
            }

            const momentRes = await getMomentById(user.token, momentId);

            if (momentRes.resCode === 200) {
                if (momentRes.moment.createdBy._id !== user.user.id) {
                    navigate("/error/404");
                }

                setMoment({
                    data: momentRes.moment,
                    submitStatus: "idle",
                });
            } else {
                navigate(`/error/${momentRes.resCode}`);
            }
        };

        fetchMoment();
    }, [momentId, navigate, user]);

    const canUpload =
        Boolean(moment.data.location) &&
        ((!momentId && Boolean(moment.data.img.length)) || momentId);

    const canAddFile = moment.data.img.length < 4;

    const onSubmit = async (e) => {
        e.preventDefault();

        let response;
        if (!momentId) {
            response = await createMoment(user.token, {
                location: moment.data.location,
                description: moment.data.description,
                images: moment.data.img,
            });
        } else {
            response = await updateMoment(user.token, momentId, {
                location: moment.data.location,
                description: moment.data.description,
            });
        }

        if (response.resCode === 201 || response.resCode === 200) {
            navigate(`/moments/${response.moment._id}`);
        } else {
            console.log(`An error ocurred during submission`);
            navigate(`/error/${response.resCode}`);
        }
    };

    const onChange = (e) => {
        setMoment((prevMoment) => ({
            ...prevMoment,
            data: {
                ...prevMoment.data,
                [e.target.name]:
                    e.target.name === "img"
                        ? addImage(prevMoment.data.img, e.target.files)
                        : e.target.value,
            },
        }));
    };

    const onRemoveImage = (e) => {
        e.preventDefault();

        setSelectedIndex((prevIndex) => {
            if (prevIndex && prevIndex === moment.data.img.length - 1) {
                return prevIndex - 1;
            } else if (0 < prevIndex) {
                return prevIndex
            } else {
                return 0;
            }
        });

        setMoment((prevMoment) => ({
            ...prevMoment,
            data: {
                ...prevMoment.data,
                img: prevMoment.data.img.filter(
                    (image, index) => selectedIndex !== index
                ),
            },
        }));
    };

    const addImage = (prevFiles, files) => {
        let finalFiles = [];
        const fileArray = Array.from(files);
        if (prevFiles.length > 0) {
            finalFiles = prevFiles.concat(fileArray).slice(0, 4);
        } else {
            finalFiles = fileArray.slice(0, 4);
        }
        
        return finalFiles;
    };

    const onAddImage = (e) => {
        e.preventDefault();

        fileInput.current.click();
    };

    const renderedImage =
        moment.submitStatus !== "loading" &&
        (momentId ? (
            <div className="container_momentform-fileinp">
                <MomentImages
                    images={moment.data.img}
                    imgClass={`container_momentform-preview_img ${
                        moment.data.img.length > 1
                            ? `container_momentform-preview_imgs`
                            : "container_momentform-preview"
                    }`}
                    sliderClass="container_momentform-preview"
                    containerClass="container_momentform-preview_imgcont"
                />
            </div>
        ) : (
            <div className="container_momentform-fileinp">
                <input
                    multiple
                    ref={fileInput}
                    type="file"
                    name="img"
                    id="images"
                    accept="image/png, image/jpg, image/jpeg"
                    onChange={onChange}
                    disabled={!canAddFile}
                    value=""
                />

                {moment.data.img.length ? (
                    <>
                        <MomentImages
                            images={moment.data.img.map((file) => ({
                                _id: file.name,
                                url: URL.createObjectURL(file),
                            }))}
                            imgClass="container_momentform-preview_img container_momentform-preview_imgs"
                            sliderClass="container_momentform-preview"
                            containerClass="container_momentform-preview_imgcont"
                            afterSliding={setSelectedIndex}
                        />
                        <button
                            className="container_momentform-addimg"
                            disabled={!canAddFile}
                            onClick={onAddImage}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <button
                            className="container_momentform-rmvimg"
                            onClick={onRemoveImage}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon
                            icon={faFileAlt}
                            className="container_momentform-fileinpic"
                        />
                        <h2>Drag photos here</h2>
                    </>
                )}
            </div>
        ));

    return (
        <>
            {moment.submitStatus === "loading" && (
                <FontAwesomeIcon icon={faSpinner} spin />
            )}
            {moment.submitStatus !== "loading" && (
                <form
                    className="container_momentform-card scale-in-center"
                    onSubmit={onSubmit}
                >
                    <div className="container_momentform-cardcontrol">
                        <p>{momentId ? "Edit Post" : "Create New Post"}</p>
                        <button disabled={!canUpload}>Share</button>
                    </div>
                    <div className="container_momentform">
                        {renderedImage}
                        <div className="container_momentform-right">
                            <div className="container_momentform-usr">
                                <img
                                    src={
                                        user.user.profileImg
                                            ? `${BACKEND_URL}/images/${user.user.profileImg.url}`
                                            : `${BACKEND_URL}/images/profileph.jpg`
                                    }
                                    alt="user-profile-img"
                                    className="container_momentform-usricon"
                                />
                                <p>{user.user.username}</p>
                            </div>
                            <textarea
                                name="description"
                                placeholder="Write a description..."
                                maxLength={256}
                                value={moment.data.description}
                                onChange={onChange}
                                className="container_momentform-descinp"
                            />
                            <div className="container_momentform-locinp">
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    onChange={onChange}
                                    placeholder="Add a location..."
                                    value={moment.data.location}
                                />
                                <FontAwesomeIcon
                                    icon={faMapMarkerAlt}
                                    className="container_momentform-locinpimg"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default MomentForm;
