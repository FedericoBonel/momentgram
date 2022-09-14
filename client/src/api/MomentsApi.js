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

export { getMomentsFor };
