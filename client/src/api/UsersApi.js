const USERS_URI = process.env.REACT_APP_BACKEND_URI;
const SERVER_HOST = process.env.REACT_APP_SERVER_HOST;

const authenticateUser = async (user) => {
    const loginUri = `${USERS_URI}/auth/login`;
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
    const registerUri = `${USERS_URI}/auth/register?host=${SERVER_HOST}`;
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
        const verifyUri = `${USERS_URI}/users/verify/${verificationCode}`
        const response = await fetch(verifyUri);
    
        const payload = await response.json();
        const resCode = response.status;
    
        return {...payload.data, resCode};
        
    } catch (error) {
        console.log(`An error ocurred during user verification: ${error}`);
        return { resCode: 500 };   
    }
}

const getUserByUsername = async (token, username) => {
    
}

export { authenticateUser, registerUser, verifyAccount };
