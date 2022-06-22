import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import react from "react";
import { authService } from "../myBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faGoogle,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
  const [form, setForm] = react.useState({ email: "", password: "" });
  const [hasAccount, setHasAccount] = react.useState(true);
  const [error, setError] = react.useState("");

  const onChange = ({ target: { name, value } }) => {
    setForm({ ...form, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (hasAccount) {
        //sign in
        await signInWithEmailAndPassword(
          authService,
          form.email,
          form.password
        );
      } else {
        //create account
        await createUserWithEmailAndPassword(
          authService,
          form.email,
          form.password
        );
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const createAccount = () => {
    setHasAccount(!hasAccount);
  };

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(authService, provider);
  };

  return (
    <div className="authContainer">
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <form onSubmit={onSubmit} className="container">
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          onChange={onChange}
          className="authInput"
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          required
          onChange={onChange}
          className="authInput"
        />
        <input
          type="submit"
          value={hasAccount ? "Log In" : "New Account"}
          className="authInput authSubmit"
        />
      </form>

      <span className="authError">{error}</span>
      <span onClick={createAccount} className="authSwitch">
        {hasAccount ? "Create account" : "Back to sign in"}
      </span>
      <div className="authBtns">
        <button name="google" onClick={onSocialClick} className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button name="github" onClick={onSocialClick} className="authBtn">
          Continue with github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
