import "./PasswordUpdateForm.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PasswordUpdateForm = ({ user }) => {
    const onSubmit = async (e) => {
        e.preventDefault();

        // Todo
    };

    return (
        <div className="container_passupd">
            <div className="container_passupd-usrrow">
                <img
                    className="container_passupd-profimg"
                    src={
                        user.user.profileImg
                            ? `${BACKEND_URL}/images/${user.profileImg.url}`
                            : `${BACKEND_URL}/images/profileph.jpg`
                    }
                    alt="profile-img"
                />
                <div>
                    <p>{user.user.username}</p>
                </div>
            </div>

            <form className="container_passupd-form" onSubmit={onSubmit}>
                <div className="container_passupd-form_input">
                    <aside>
                        <label htmlFor="oldPassword">Old Password</label>
                    </aside>
                    <div className="container_passupd-form_input-r">
                        <input
                            type="text"
                            id="oldPassword"
                            name="oldPassword"
                        />
                    </div>
                </div>
                <div className="container_passupd-form_input">
                    <aside>
                        <label htmlFor="newPassword">New Password</label>
                    </aside>
                    <div className="container_passupd-form_input-r">
                        <input
                            type="text"
                            id="newPassword"
                            name="newPassword"
                        />
                    </div>
                </div>
                <div className="container_passupd-form_input">
                    <aside>
                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                    </aside>
                    <div className="container_passupd-form_input-r">
                        <input
                            type="text"
                            id="confirmPassword"
                            name="confirmPassword"
                        />
                    </div>
                </div>
                <button className="container_passupd-form_submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default PasswordUpdateForm;
