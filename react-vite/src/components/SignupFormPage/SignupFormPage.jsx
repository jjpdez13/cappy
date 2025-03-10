import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!username.trim()) newErrors.username = "Username is required";
    if (username.length < 4) newErrors.username = "Username must be at least 4 characters";
    if (!password) newErrors.password = "Password is required";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords must match";

    setErrors(newErrors);
  }, [firstName, lastName, email, username, password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/menus");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Employee Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        {errors.firstName && <p className="error-message">{errors.firstName}</p>}

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        {errors.lastName && <p className="error-message">{errors.lastName}</p>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {errors.confirmPassword && (
          <p className="error-message">{errors.confirmPassword}</p>
        )}

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;