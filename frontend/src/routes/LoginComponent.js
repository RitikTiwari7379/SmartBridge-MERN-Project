import React from "react";
import TextInput from "../components/shared/TextInput";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../src/logo.png";
import "../index.css";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { makeUnauthenticatedPOSTRequest } from "../utils/serverHelper";

const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmailFormat = (email) => {
    // Regular expression for a simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const Login = async () => {
    if (!validateEmailFormat(email)) {
      setIsValidEmail(false);
      alert("Not a valid E-MAIL");
    }

    const data = { email, password };
    const response = await makeUnauthenticatedPOSTRequest("/auth/login", data);

    if (response && !response.err) {
      console.log(response);
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });
      alert("success");
      navigate("/LoggedInHome");
    } else {
      alert("failure");
    }
  };

  return (
    <>
      <section className="header ">
        <div className="login-container logo p-0">
          <img src={logo} alt="hello" height={300} width={300} />
        </div>
      </section>

      <div className="flex flex-col items-center font-bold mb-8 my-5">
        To continue, log in to TuneTrail.
      </div>

      <div className="flex flex-col items-center  ">
        <div className="flex flex-col items-center py-1 mb-2">
          <div id="signin" className="py-1 mb-5">
            {/* {user && (
              <div>
                <img src={user.picture} alt={user.name}></img>
                <h3>{user.name}</h3>
              </div>
            )} */}
          </div>
        </div>

        <hr></hr>

        <TextInput
          type={"text"}
          label={"Email ID or Username"}
          placeholder={"Email ID or Username"}
          value={email}
          className={`w-1/5 mb-5 mt-5 ${!isValidEmail ? "border-red-500" : ""}`}
          setValue={(value) => {
            setEmail(value);
            setIsValidEmail(true); // Reset the validation when the user starts typing again
          }}
        />
        <TextInput
          type={"password"}
          label={"Password"}
          placeholder={"Password"}
          className={"w-1/5 mb-5"}
          value={password}
          setValue={setPassword}
        />
        <button
          className="btn mb-2"
          onClick={(e) => {
            Login();
          }}
        >
          LOG IN
        </button>

        <br />

        <hr></hr>

        <div className="flex flex-col items-center py-2 ">
          <div className="font-bold text-xl mb-1 pt-2">
            Don't have an account ?
          </div>
          <Link to="/signup">
            <button className="btn mb-1">SIGN UP</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginComponent;
