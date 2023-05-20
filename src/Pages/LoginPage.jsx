import React from "react";
import "../Css/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import firebase from "firebase/compat/app";
import { db } from "../Firebase/config";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import orgLogo from "../Assets/Logos/organization_Logo.png";
import LoginGifVid from "../Assets/Images/LoginGifVid.mp4";
import axios from "axios";
// MUI MODAL COMPONENT
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/system";
import LoadingButton from "@mui/lab/LoadingButton";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Modal MUI Style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "360px",
  bgcolor: "background.paper",
  border: "1px solid #0086c9",
  borderRadius: "23px",
  boxShadow: 24,
  p: 2,
};

const SaveButton = styled(LoadingButton)({
  backgroundColor: "#00233a",
  "&:hover": {
    backgroundColor: "#393c41",
  },
});

const LoginPage = ({
  isSuperAdmin,
  isAdmin,
  isStaff,
  isTeacher,
  isStudent,
}) => {
  const navigate = useNavigate();
  const [isLogging, setIsLogging] = useState(false);
  const [isFinding, setIsFinding] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    successfullySent: false,
    error: false,
  });

  const [id, setId] = useState("");
  const [alertState, setAlertState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = alertState;
  const [loginForm, setLoginForm] = useState({
    id: "",
    password: "",
  });

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
    setForgotPasswordForm({
      successfullySent: false,
      error: false,
    });
  };
  const handleForgotPasswordOpen = (e) => {
    e.preventDefault();
    setShowForgotPassword(true);
  };
  const forgotPasswordChange = (e) => {
    e.preventDefault();
    setForgotPasswordForm({
      ...forgotPasswordForm,
      [e.target.name]: e.target.value,
    });
  };

  const getResetPasswordLink=(email)=>{
    axios
    .post("https://lmsserver.up.railway.app/user/password-reset", {
      email: email,
    })
    .then((res) => {
      const link = res.data.link;
      setIsFinding(false);
      // Open the link in a new tab
      window.open(link, "_blank");
    })
    .catch((err) => {
      setForgotPasswordForm({ ...forgotPasswordForm, error: true });
      setIsFinding(false);
      console.log(err);
    });
  }
  // Super Admin Password Reset 
  const handleSuperAdminPasswordReset = (e) => {
    e.preventDefault();
    setIsFinding(true);
    firebase
      .auth()
      .sendPasswordResetEmail(forgotPasswordForm.email)
      .then(() => {
        setForgotPasswordForm({
          ...forgotPasswordForm,
          successfullySent: true,
        });
        setIsFinding(false);
      })
      .catch((error) => {
        setForgotPasswordForm({ ...forgotPasswordForm, error: true });
        setIsFinding(false);
        console.error(error);
      });
  };

  // // Reset Password For Admin 
  // const resetPassword = async (e) => {
  //   e.preventDefault();
  //   setIsFinding(true);
  //   try {
  //     if (forgotPasswordForm.id.match(/^a\d{4}$/)) {

  //       await getResetPasswordLink(`${forgotPasswordForm.id}@nexskill.edu.pk`);
  //     } 
  //     else {
  //       setIsFinding(false);
  //       setForgotPasswordForm({ ...forgotPasswordForm, error: true });
  //     }
  //   } catch (error) {
  //     // handle the error here, for example:
  //     // console.log(error);
  //     setIsFinding(false);
  //     setForgotPasswordForm({ ...forgotPasswordForm, error: true });
  //   }
  // };
  
  

  // For Error Toast
  const handleClick = () => {
    setAlertState({ ...alertState, open: true });
  };
  const handleClose = () => {
    setAlertState({ ...alertState, open: false });
  };

  const handleChange = (e) => {
    if (e.target.name === "id") {
      setLoginForm({
        ...loginForm,
        [e.target.name]: e.target.value,
      });
      setId(e.target.value.toLowerCase());
    } else {
      setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLogging(true);
    if (isAdmin) {
      if (loginForm.id.match(/^a\d{4}$/)) {
        firebase
          .auth()
          .signInWithEmailAndPassword(
            `${loginForm.id.toLowerCase()}@teps.edu.pk`,
            loginForm.password
          )
          .then((res) => {
            // Fetching the user firebase id and storing at the local storage then navigating to dashboard
            db.collection("admin")
              .where("aid", "==", id)
              .get()
              .then((res) => {
                localStorage.setItem("adminUser", res.docs[0].id);
                navigate("../admin/dashboard", {
                  state: { user: res.docs[0].data() },
                });
                setIsLogging(false);
              });
          })
          .catch((err) => {
            handleClick();
            setIsLogging(false);
          });
      } else {
        handleClick();
        setIsLogging(false);
      }
    } else if (isSuperAdmin) {
      // Taking id as the email here from the login form
      try {
        firebase
          .auth()
          .signInWithEmailAndPassword(loginForm.id, loginForm.password)
          .then((res) => {
            // Fetching the user firebase id and storing at the local storage then navigating to dashboard
            db.collection("superadmin")
              .where("email", "==", id)
              .get()
              .then((res) => {
                localStorage.setItem("sAdminUser", res.docs[0].id);
                // Also passing the user data as props
                navigate("../sadmin/dashboard", {
                  state: { user: res.docs[0].data() },
                });
                setIsLogging(false);
              });
          })
          .catch((err) => {
            handleClick();
            setIsLogging(false);
          });
      } catch (err) {
        handleClick();
        setIsLogging(false);
      }
    } else if (isStaff) {
      if (loginForm.id.match(/^e\d{4}$/)) {
        firebase
          .auth()
          .signInWithEmailAndPassword(
            `${loginForm.id.toLowerCase()}@teps.edu.pk`,
            loginForm.password
          )
          .then((res) => {
            // Fetching the user firebase id and storing at the local storage then navigating to dashboard
            db.collection("staff")
              .where("staffid", "==", id)
              .get()
              .then((res) => {
                localStorage.setItem("staffUser", res.docs[0].id);
                // Also passing the user data as props
                navigate("../staff/dashboard", {
                  state: { user: res.docs[0].data() },
                });
                setIsLogging(false);
              });
          })
          .catch((err) => {
            handleClick();
            setIsLogging(false);
          });
      } else {
        handleClick();
        setIsLogging(false);
      }
    } else if (isStudent) {
      if (loginForm.id.match(/^s\d{5}$/)) {
        firebase
          .auth()
          .signInWithEmailAndPassword(
            `${loginForm.id.toLowerCase()}@teps.edu.pk`,
            loginForm.password
          )
          .then((res) => {
            // Fetching the user firebase id and storing at the local storage then navigating to dashboard
            db.collection("students")
              .where("sid", "==", id)
              .get()
              .then((res) => {
                localStorage.setItem("studentUser", res.docs[0].id);
                // Also passing the user data as props
                navigate("../student/dashboard", {
                  state: { user: res.docs[0].data() },
                });
                setIsLogging(false);
              });
          })
          .catch((err) => {
            handleClick();
            setIsLogging(false);
          });
      } else {
        alert(loginForm.id);
        handleClick();
        setIsLogging(false);
      }
    } else if (isTeacher) {
      if (loginForm.id.match(/^t\d{4}$/)) {
        firebase
          .auth()
          .signInWithEmailAndPassword(
            `${loginForm.id.toLowerCase()}@teps.edu.pk`,
            loginForm.password
          )
          .then((res) => {
            // Fetching the user firebase id and storing at the local storage then navigating to dashboard
            db.collection("teachers")
              .where("tid", "==", id)
              .get()
              .then((res) => {
                localStorage.setItem("teacherUser", res.docs[0].id);
                // Also passing the user data as props
                navigate("../teacher/dashboard", {
                  state: { user: res.docs[0].data() },
                });
                setIsLogging(false);
              });
          })
          .catch((err) => {
            handleClick();
            setIsLogging(false);
          });
      } else {
        handleClick();
        setIsLogging(false);
      }
    }
  };

  return (
    <>
      <div className="limiter">
        {/* Forgot Password Modal */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={showForgotPassword}
          onClose={handleForgotPasswordClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={showForgotPassword}>
            <Box sx={style}>
              {isSuperAdmin ? (
                <>
                  {" "}
                  {/* SuccessFully Send Alert */}
                  {forgotPasswordForm.successfullySent ? (
                    <div class="alert alert-success" role="alert">
                      Reset Link has been successfully sent to this email
                    </div>
                  ) : (
                    ""
                  )}
                  {/* Error Alert */}
                  {forgotPasswordForm.error ? (
                    <div class="alert alert-danger" role="alert">
                      Something Went Wrong
                    </div>
                  ) : (
                    ""
                  )}
                  <form
                    // If Super Admin Run different function and for others run different
                    onSubmit={(e) => {
                      handleSuperAdminPasswordReset(e)
                    }}
                  >
                    {isSuperAdmin ? (
                      <div className=" w-100">
                        {/* Email Input For Super Admin  */}
                        <div className="d-flex flex-column mt-2 ">
                          <TextField
                            id="outlined-basic"
                            type="text"
                            name="email"
                            label="Enter Your Email"
                            value={forgotPasswordForm.email}
                            onChange={(e) => {
                              forgotPasswordChange(e);
                            }}
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {/* Save Button */}
                    <div className="d-flex justify-content-center mt-2">
                      <SaveButton
                        color="secondary"
                        type="submit"
                        loading={isFinding}
                        loadingPosition="start"
                        startIcon={<SearchIcon />}
                        variant="contained"
                        className="w-100"
                        disabled={isFinding}
                      >
                        <span>{(!isFinding)?"Find":"Please Wait..."}</span>
                      </SaveButton>
                    </div>
                  </form>
                </>
              ) : (
                <div class="alert alert-secondary" role="alert">
                  Contact Administration for password reset
                </div>
              )}
            </Box>
          </Fade>
        </Modal>

        {/* Error Message Toaster */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          autoHideDuration={1500}
          key={vertical + horizontal}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            Incorrect ID and Password
          </Alert>
        </Snackbar>

        <div className="container-login100">
          <div className="wrap-login100">
            <form
              className="login100-form validate-form"
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <span className="login100-form-title pb-2 d-flex flex-column">
                <div className="bg-dark">
                  <img src={orgLogo} className="mr-auto" alt="#" width={150} />
                </div>
                <div className="mt-4">
                  {isSuperAdmin
                    ? "Super Admin"
                    : isAdmin
                    ? "Admin"
                    : isStaff
                    ? "Staff"
                    : isTeacher
                    ? "Teacher"
                    : isStudent
                    ? "Student"
                    : ""}{" "}
                  Login
                </div>
              </span>

              <TextField
                id="outlined-basic"
                label={isSuperAdmin ? "Email" : "ID"}
                variant="outlined"
                className="w-100 mt-1"
                type="text"
                required
                name="id"
                onChange={(e) => {
                  handleChange(e);
                }}
                autoFocus={loginForm.id !== ""}
                title="Input value should be in the format 't/s/a-____', where ____ is a combination of letters and numbers"
              />

              <TextField
                className="w-100 mt-3"
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                name="password"
                value={loginForm.password}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              />

              <div className="flex-sb-m w-100 pt-3 pb-3">
                <div>
                  <div
                    className="txt1 text-right"
                    onClick={(e) => {
                      handleForgotPasswordOpen(e);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Forgot Password?
                  </div>
                </div>
              </div>

              <div className="container-login100-form-btn">
                <button
                  className="login100-form-btn"
                  type="submit"
                  disabled={isLogging === true}
                >
                  {isLogging ? "Please Wait..." : "Login"}
                </button>
              </div>
            </form>

            {/* Carousel */}
            <div className="login100-more my-auto">
              <div
                id="carouselExampleIndicators"
                class="carousel slide"
                data-bs-ride="carousel"
                data-interval="0.1"
              >
                <div className="carousel-indicators"></div>
                <div class="carousel-inner">
                  <div class="carousel-item active">
                
                <video src={LoginGifVid} className="d-block w-100" autoPlay loop muted></video>


                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
