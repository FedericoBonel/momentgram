const BASE_BACKEND_URL = process.env.REACT_APP_BACKEND_URI;

const getMomentsFor = async (token, page) => {
    const momentsUri = `${BASE_BACKEND_URL}/moments?page=${page}`;
    try {
        const response = await fetch(momentsUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "GET",
        });

        const payload = await response.json();
        const resCode = response.status;

        return { moments: payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during moments fetching: ${error}`);
        return { resCode: 500 };
    }
};

const getMomentById = async (token, momentId) => {
    const momentUri = `${BASE_BACKEND_URL}/moments/${momentId}`;
    try {
        const response = await fetch(momentUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "GET",
        });

        const payload = await response.json();
        const resCode = response.status;

        return { moment: payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during moments fetching: ${error}`);
        return { resCode: 500 };
    }
};

const createMoment = async (token, moment) => {
    const momentsUri = `${BASE_BACKEND_URL}/moments`;
    try {
        // Create base moment
        const response = await fetch(momentsUri, {
            headers: {
                "content-type": "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify({
                location: moment.location,
                description: moment.description,
            }),
        });

        const payload = await response.json();
        const resCode = response.status;

        console.log(payload);

        if (resCode !== 201) {
            return { resCode };
        }

        // Save image
        const newMomentUri = `${BASE_BACKEND_URL}/moments/${payload.data._id}/images`;
        let formData = new FormData();
        formData.append("image", moment.images);

        const imageSavedRes = await fetch(newMomentUri, {
            headers: {
                authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: formData,
        });

        const finalPayload = await imageSavedRes.json();
        const finalResCode = imageSavedRes.status;

        if (resCode === 201) {
            return { moment: finalPayload.data, resCode: finalResCode };
        } else {
            return { resCode: finalResCode };
        }
    } catch (error) {
        console.log(`An error happened during moment creation`);
    }
};

const getMomentComments = async (token, momentId, page) => {
    const momentUri = `${BASE_BACKEND_URL}/moments/${momentId}/comments?page=${page}`;
    try {
        const response = await fetch(momentUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "GET",
        });

        const payload = await response.json();
        const resCode = response.status;

        return { comments: payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during moments fetching: ${error}`);
        return { resCode: 500 };
    }
};

const postNewComment = async (token, momentId, comment) => {
    const momentUri = `${BASE_BACKEND_URL}/moments/${momentId}/comments`;
    try {
        const response = await fetch(momentUri, {
            headers: {
                "content-type": "application/json",
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify({ comment }),
        });

        const payload = await response.json();
        const resCode = response.status;

        return { comment: payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during moments fetching: ${error}`);
        return { resCode: 500 };
    }
};

const deleteComment = async (token, momentId, commentId) => {
    const momentUri = `${BASE_BACKEND_URL}/moments/${momentId}/comments/${commentId}`;
    try {
        const response = await fetch(momentUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "DELETE",
        });

        const payload = await response.json();
        const resCode = response.status;

        return { comment: payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during moments fetching: ${error}`);
        return { resCode: 500 };
    }
};

const likeMoment = async (token, momentId) => {
    const momentUri = `${BASE_BACKEND_URL}/moments/${momentId}/likes`;
    try {
        const response = await fetch(momentUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "POST",
        });

        const resCode = response.status;

        return { resCode };
    } catch (error) {
        console.log(`An error ocurred during moments fetching: ${error}`);
        return { resCode: 500 };
    }
};

const disLikeMoment = async (token, momentId) => {
    const momentUri = `${BASE_BACKEND_URL}/moments/${momentId}/likes`;
    try {
        const response = await fetch(momentUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "DELETE",
        });

        const resCode = response.status;

        return { resCode };
    } catch (error) {
        console.log(`An error ocurred during moments fetching: ${error}`);
        return { resCode: 500 };
    }
};

export {
    getMomentsFor,
    getMomentById,
    createMoment,
    getMomentComments,
    postNewComment,
    deleteComment,
    likeMoment,
    disLikeMoment
};
