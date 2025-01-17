import styled from "styled-components";
import { Link } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";

function SignUpPage({ onSignUp }) {
    return (
        <Wrapper>
        <br />
        <SignUpForm onSignUp={onSignUp} />
        <Divider />
        <p className="text-[#b7b7b7]">
            Already have an account? &nbsp;
            <button className="bg-[#ba1c2f] text-white py-1 px-4 rounded-md hover:bg-red-700">
                <Link to="/login">Log In</Link>
            </button>
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

export default SignUpPage;