import { useNavigate } from "react-router-dom";

function SignupButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/signup")} className="signup-btn">
      SIGN UP!
    </button>
  );
}

export default SignupButton;