import React, { useState } from "react";
import styled from "styled-components";
import * as Components from "./styles/Components";
import { useNavigate } from "react-router-dom";
import { obtainToken, forgotPassword } from "../../services/auth/auth-api.js";

import { ProgressSpinner } from "primereact/progressspinner";

import Lottie from "lottie-react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import MpiraPhonelottie from "../../assets/lotties/lottiefiles/animation_lley26fl.json";
import ProcessDocuments from "../../assets/lotties/nice-hop/documets-processed.json";

import WaterAndEnviromentData from "../../assets/lotties/lottiefiles/WaterAndEnviroment.json";
import WaterLoading from "../../assets/lotties/lottiefiles/WaterLoading.json";
// import ForgotPassword from "./lottiefiles/ForgotPassword.json";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import OpenEye from "../../assets/lotties/lottiefiles/83983-eye-icon.json";

//==== google
import { postThirdPartyRegisterAuth, postThirdPartyLoginAuth } from "../../services/auth/auth-api.js";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { Grid, Divider, Typography, CircularProgress } from "@mui/material";

function NewLoginPage() {
    const queryClient = useQueryClient();
    const [signIn, toggle] = React.useState(true);
    let navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    // const [show, setShow] = useState(false);
    // const [loading, setLoading] = useState(false);
    const [passwordType, setPasswordType] = useState("password");
    const [formData, setFormData] = useState();

    const [isfocused, setIsFocused] = useState(false);

    const handleInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = () => {
        setIsFocused(false);
    };

    const togglePassword = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            return;
        }
        setPasswordType("password");
    };

    const handleChange = (e) => {
        e.preventDefault();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [loginMutationIsLoading, setLoginMutationIsLoading] = useState(false);
    const loginMutation = useMutation({
        mutationFn: (variables) => obtainToken(variables?.email, variables?.password),
        onSuccess: (data) => {
            console.log("successfull login : xxxxx data : ", data);
            queryClient.invalidateQueries([]);
            setLoginMutationIsLoading(false);
            navigate("/");
            // window.location.reload();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message ? error?.response?.data?.message : "An error Occured while Logging You In ! please Contact Administrator");
            setLoginMutationIsLoading(false);
            console.log("login error : ", error);
        },
    });

    const [forgotPasswordMutationIsLoading, setForgotPasswordMutationIsLoading] = useState(false);
    const forgotPasswordMutation = useMutation({
        mutationFn: forgotPassword,
        onSuccess: (data) => {
            queryClient.invalidateQueries([]);
            console.log("data nnnnn is : ", data);
            setForgotPasswordMutationIsLoading(false);
            data?.data?.success ? toast.success(data?.data?.message) : toast.warning(data?.data?.message);
        },
        onError: (error) => {
            console.log("data nnnnn is : errorrr ", error);
            setForgotPasswordMutationIsLoading(false);
            // toast.error(error?.message ? error?.message : "An error Occured while processing your Email ! please Contact Administrator");
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
        },
    });

    const handleForgotPasssword = async (event) => {
        event.preventDefault();
        if (!email) {
            toast.warning("Email is required");
        } else {
            setForgotPasswordMutationIsLoading(true);
            forgotPasswordMutation.mutate(email);
        }
    };

    const handleSubmit = async (event) => {
        // toggle(false);
        const form = event.currentTarget;
        let invalid = false;
        event.preventDefault();
        if (form.checkValidity() === false) {
            //event.preventDefault();
            event.stopPropagation();
            invalid = true;
        }
        if (!formData?.email || !formData?.password) {
            // setMessage("Invalid empty fields");
            // setTimeout(() => setMessage(""), 5000);
            toast.warning("Both Fields are required");
        } else {
            if (invalid === false) {
                setLoginMutationIsLoading(true);
                console.log("Form Submitted");
                loginMutation.mutate(formData);
            }
        }
    };

    //======================= google login =========================
    const [isLoadingThirdPartyLogin, setIsLoadingThirdPartyLogin] = useState(false);
    const thirdPartyLoginAuthMutation = useMutation({
        mutationFn: (variables) => postThirdPartyLoginAuth(variables),
        onSuccess: (data) => {
            console.log("postThirdPartyAuth data : ", data);
            setIsLoadingThirdPartyLogin(false);
            queryClient.invalidateQueries([]);
            //   axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            navigate("/");
            // window.location.reload();
        },
        onError: (error) => {
            error?.response?.data?.message ? toast.error(error?.response?.data?.message) : !error?.response ? toast.warning("Check Your Internet Connection Please") : toast.error("An Error Occured Please Contact Admin");
            setIsLoadingThirdPartyLogin(false);

            console.log("login error : ", error);
        },
    });

    return (
        <section className="app-intro app-sec vh-100 w-100">
            <div
                style={{
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                }}
            >
                <Components.Container>
                    <div>
                        <Components.SignUpContainer signinIn={signIn}>
                            <Components.Form>
                                <h3>
                                    <b>Forgot Password</b>
                                </h3>
                                {forgotPasswordMutationIsLoading && (
                                    <div style={{ width: "100%" }}>
                                        <Lottie animationData={WaterLoading} loop={true} autoplay={true} />
                                    </div>
                                )}
                                <h5>Enter Email</h5>
                                <Components.Input type="email" placeholder="Email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Components.Button onClick={handleForgotPasssword} disabled={forgotPasswordMutationIsLoading}>
                                    {forgotPasswordMutationIsLoading ? (
                                        <center>
                                            <i className="fa fa-spinner fa-spin" />
                                        </center>
                                    ) : (
                                        "Submit"
                                    )}
                                </Components.Button>

                                <Components.Anchor href="#" onClick={() => toggle(true)}>
                                    Login
                                </Components.Anchor>
                            </Components.Form>
                        </Components.SignUpContainer>
                    </div>

                    <div style={{ width: "100%" }}>
                        <Components.SignInContainer signinIn={signIn}>
                            <Components.Form>
                                <Components.Title>NICE HOUSE OF PLASTICS</Components.Title>
                                <h3>Login</h3>
                                {loginMutationIsLoading && (
                                    <div style={{ width: "100%" }}>
                                        <Lottie animationData={WaterLoading} loop={true} autoplay={true} />
                                    </div>
                                )}
                                {/* {loginMutation.isError && (
                  <p
                    style={{ dispaly: "block", padding: "10px", color: "red" }}
                  >
                    Invalid Username or Password!
                  </p>
                )} */}
                                {message && <p style={{ dispaly: "block", padding: "10px", color: "red" }}>{message}</p>}
                                <div style={{ width: "100%" }}>
                                    <Components.Input type="text" value={formData?.email} name="email" onChange={handleChange} placeholder="Email" />
                                </div>

                                <PasswordInput isFocused={isfocused}>
                                    <input value={formData?.password} placeholder="Password" name="password" type={passwordType} onChange={handleChange} onFocus={handleInputFocus} onBlur={handleInputBlur} />
                                    <div onClick={togglePassword}>{passwordType === "password" ? <VisibilityOffIcon /> : <Lottie animationData={OpenEye} style={{ width: "25px" }} loop={true} autoplay={true} />}</div>
                                </PasswordInput>

                                <Components.Anchor onClick={() => toggle(false)} href="#">
                                    Forgot your password?
                                </Components.Anchor>
                                <Components.Button onClick={handleSubmit} disabled={loginMutationIsLoading}>
                                    {loginMutationIsLoading ? (
                                        <center>
                                            <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>
                                        </center>
                                    ) : (
                                        "Login"
                                    )}
                                </Components.Button>
                                <br />

                                <Grid item xs={12}>
                                    <Divider>
                                        <Typography variant="caption"> Login with</Typography>
                                    </Divider>
                                </Grid>

                                <Grid item xs={12}>
                                    <center>
                                        {isLoadingThirdPartyLogin ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <GoogleLogin
                                                // theme={theme === 'dark' ? 'filled_blue' : 'outline'}
                                                onSuccess={async (response) => {
                                                    console.log(response);
                                                    let responseDecoded = jwtDecode(response?.credential);
                                                    console.log("🚀 ~ Login ~ responseDecoded:", responseDecoded);
                                                    let dataToPost = {
                                                        name: responseDecoded?.name,
                                                        picture: responseDecoded?.picture,
                                                        client_id: response?.clientId,
                                                        provider: "google",
                                                        email: responseDecoded?.email,
                                                    };
                                                    setIsLoadingThirdPartyLogin(true);
                                                    thirdPartyLoginAuthMutation.mutate(dataToPost);
                                                }}
                                                onError={() => {
                                                    console.log("Login Failed");
                                                }}
                                            />
                                        )}
                                    </center>
                                    {/* <FirebaseSocial /> */}
                                </Grid>
                            </Components.Form>
                        </Components.SignInContainer>
                    </div>

                    <div style={{ width: "100%" }}>
                        <Components.OverlayContainer signinIn={signIn}>
                            <Components.Overlay signinIn={signIn}>
                                <Components.LeftOverlayPanel signinIn={signIn}>
                                    <h2 style={{ textTransform: "none", marginBottom: "-0.3rem" }}>NICE HOUSE OF PLASTICS</h2>

                                    <div style={{ width: "100%" }}>
                                        <Lottie animationData={ProcessDocuments} loop={true} autoplay={true} />
                                    </div>
                                </Components.LeftOverlayPanel>

                                <Components.RightOverlayPanel signinIn={signIn}>
                                    <h2 style={{ textTransform: "none", marginBottom: "-0.3rem" }}>NICE HOUSE OF PLASTICS</h2>
                                    <div style={{ width: "100%" }}>
                                        <Lottie animationData={ProcessDocuments} loop={true} autoplay={true} />
                                    </div>
                                    {/* <Components.GhostButton onClick={() => toggle(false)}>
              Sigin Up
            </Components.GhostButton> */}
                                </Components.RightOverlayPanel>
                            </Components.Overlay>
                        </Components.OverlayContainer>
                    </div>
                </Components.Container>
            </div>
        </section>
    );
}

export default NewLoginPage;

const PasswordInput = styled.div`
    display: flex;
    ${"" /* align-items: center; */}
    justify-content: center;
    flex-direction: row;
    width: 95%;
    outline: ${(props) => (props.isfocused ? "2px solid #04619f" : "none")};

    input {
        background-color: #eee;
        border: none;
        padding: 12px 15px;

        width: 90%;
        color: black;
    }
    input:focus {
        outline: none;
    }
    div {
        width: 10%;
        background-color: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        cursor: pointer;
    }
`;
