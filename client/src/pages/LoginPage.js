import styled from "styled-components";
import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom";

function LoginPage({ onLogin }) {
  return (
    <Wrapper>
      <br />
      <LoginForm onLogin={onLogin} />
      <Divider />
      <p className="text-[#b7b7b7]">
        Don't have an account? &nbsp;
        <Link to="/signup" className="bg-[#ba1c2f] text-white px-4 py-2 rounded-md hover:bg-red-700">
          Sign Up
        </Link>
      </p>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 500px;
  margin: 40px auto;
  padding: 16px;
`;

const Divider = styled.hr`
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 16px 0;
`;

export default LoginPage;