import React from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/shared/TextInput";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../../src/logo.png";
import "../index.css";
import { makeUnauthenticatedPOSTRequest } from "../utils/serverHelper";

const SignupComponent = () => {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const [isValidEmail, setIsValidEmail] = useState(true);

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const signUp = async () => {
    if (email !== confirmEmail) {
      alert("Emails do not match");
      return;
    }

    if (!validateEmailFormat(email)) {
      setIsValidEmail(false);
      alert("NOT A VALID E-MAIL");
    }

    const data = { email, password, username, firstName, lastName };
    const response = await makeUnauthenticatedPOSTRequest(
      "/auth/register",
      data
    );

    if (response && !response.err) {
      console.log(response);
      const token = response.token;
      const date = new Date();
      date.setDate(date.getDate() + 30);
      setCookie("token", token, { path: "/", expires: date });
      alert("success");
      navigate("/home");
    } else {
      alert("Failure");
    }
  };

  return (
    <>
      <section className="header">
        <div className="login-container logo p-0">
          <img src={logo} alt="hello" height={300} width={300} />
        </div>
      </section>
      <div className="flex flex-col items-center py-6 ">
        <div className="font-bold mb-10 text-2xl">
          Sign up to dive into Winyl
        </div>

        <div className="w-full flex justify-center items-center space-x-7 ">
          <TextInput
            type={"text"}
            label={"First name"}
            placeholder={"Enter your first name"}
            className={"w-1/5 mb-5 mt-5"}
            value={firstName}
            setValue={setFirstName}
          />

          <TextInput
            type={"text"}
            label={"Last name"}
            placeholder={"Enter a profile name"}
            className={"w-1/5 mb-5 mt-5"}
            value={lastName}
            setValue={setLastName}
          />
        </div>

        <div className=" w-full flex justify-center items-center space-x-7 ">
          <TextInput
            type={"text"}
            label={"Email"}
            placeholder={"Enter your email"}
            className={`w-1/5 mb-5 mt-5 ${
              !isValidEmail ? "border-red-500" : ""
            }`}
            value={email}
            setValue={(value) => {
              setEmail(value);
              setIsValidEmail(true);
            }}
          />

          <TextInput
            type={"text"}
            label={"Confirm Email"}
            placeholder={"Enter your email again"}
            className={`w-1/5 mb-5 mt-5 ${
              !isValidEmail ? "border-red-500" : ""
            }`}
            value={confirmEmail}
            setValue={(value) => {
              setConfirmEmail(value);
              setIsValidEmail(true);
            }}
          />
        </div>

        <div className="w-full flex justify-center items-center space-x-7 ">
          <TextInput
            type={"text"}
            label={"Username"}
            placeholder={"Enter username"}
            className={"w-1/5 mb-5 mt-5"}
            value={username}
            setValue={setUsername}
          />

          <TextInput
            type={"password"}
            label={"Password"}
            placeholder={"Create a password"}
            className={"w-1/5 mb-5 mt-5"}
            value={password}
            setValue={setPassword}
          />
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            signUp();
          }}
          className="btn mb-2"
        >
          SIGN UP
        </button>
        <br></br>

        <hr></hr>
      </div>

      <div className="flex flex-col items-center py-2 ">
        <div className="font-bold text-xl mb-1">Already have an account?</div>
        <Link to="/login">
          <button className="btn mb-1">LOG IN INSTEAD</button>
        </Link>
      </div>
    </>
  );
};

export default SignupComponent;
