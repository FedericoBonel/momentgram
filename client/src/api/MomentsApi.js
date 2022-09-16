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

export {
    getMomentsFor,
    getMomentById,
    getMomentComments,
    postNewComment,
    deleteComment,
};
