const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;
const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;

const authenticateUser = async (user) => {
    const loginUri = `${BACKEND_URI}/auth/login`;
    try {
        const response = await fetch(loginUri, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(user),
        });
        const payload = await response.json();
        const resCode = response.status;

        return { ...payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during user authentication: ${error}`);
        return { resCode: 500 };
    }
};

const registerUser = async (user) => {
    const registerUri = `${BACKEND_URI}/auth/register?host=${SERVER_HOST}`;
    try {
        const response = await fetch(registerUri, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(user),
        });

        const payload = await response.json();
        const resCode = response.status;

        return { ...payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during user registration: ${error}`);
        return { resCode: 500 };
    }
};

const verifyAccount = async (verificationCode) => {
    try {
        const verifyUri = `${BACKEND_URI}/users/verify/${verificationCode}`;
        const response = await fetch(verifyUri);

        const payload = await response.json();
        const resCode = response.status;

        return { ...payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during user verification: ${error}`);
        return { resCode: 500 };
    }
};

const getUserByUsername = async (token, username) => {
    const usersUri = `${BACKEND_URI}/users?username=${username}`;
    try {
        const response = await fetch(usersUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "GET",
        });

        const payload = await response.json();
        const resCode = response.status;

        return {
            user: payload.data[0],
            resCode: payload.data[0] ? resCode : 404,
        };
    } catch (error) {
        console.log(`An error ocurred during user fetching: ${error}`);
        return { resCode: 500 };
    }
};

const getUserMomentsById = async (token, userId) => {
    const usersUri = `${BACKEND_URI}/users/${userId}/moments`;
    try {
        const response = await fetch(usersUri, {
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
        console.log(`An error ocurred during user fetching: ${error}`);
        return { resCode: 500 };
    }
};

const followUser = async (token, userId) => {
    const usersUri = `${BACKEND_URI}/users/${userId}/followers`;
    try {
        const response = await fetch(usersUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "POST",
        });

        const payload = await response.json();
        const resCode = response.status;

        console.log(payload);

        return { moments: payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during user fetching: ${error}`);
        return { resCode: 500 };
    }
}

const unfollowUser = async (token, userId) => {
    const usersUri = `${BACKEND_URI}/users/${userId}/followers`;
    try {
        const response = await fetch(usersUri, {
            headers: {
                accept: "application/json",
                authorization: `Bearer ${token}`,
            },
            method: "DELETE",
        });

        const payload = await response.json();
        const resCode = response.status;

        return { moments: payload.data, resCode };
    } catch (error) {
        console.log(`An error ocurred during user fetching: ${error}`);
        return { resCode: 500 };
    }
}

export {
    authenticateUser,
    registerUser,
    verifyAccount,
    getUserByUsername,
    getUserMomentsById,
    followUser,
    unfollowUser
};
