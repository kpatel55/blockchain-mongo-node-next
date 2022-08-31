import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Container,
  Tab,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import { useUserContext } from "../contexts/UserContext";
import api from "../services/api";

type LoginFormValues = {
  username: string;
  password: string;
};

type RegisterFormValues = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const Login = () => {
  const { setLoading, setAuthenticated, setCurrentUser } = useUserContext();
  const [tabVal, setTabVal] = useState<string>("login");

  const formikLogin = useFormik<LoginFormValues>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: () => {
      setLoading(true);
      const successCallback = (currentUser: any) => {
        setAuthenticated(true);
        setCurrentUser(currentUser);
        setLoading(false);
      };
      api.user.login(
        formikLogin.values.username,
        formikLogin.values.password,
        successCallback
      );
    },
  });

  const formikRegister = useFormik<RegisterFormValues>({
    initialValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      password: Yup.string()
        .required("Required")
        .min(8, "Must be 8 characters or more")
        .matches(/[a-z]+/, "One lowercase character")
        .matches(/[A-Z]+/, "One uppercase character")
        .matches(/[@$!%*#?&]+/, "One special character")
        .matches(/\d+/, "One number"),
      firstName: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    }),
    onSubmit: () => {
      const successCallback = () => {
        formikRegister.resetForm();
        setTabVal("login");
      };
      api.user.register(
        formikRegister.values.username,
        formikRegister.values.password,
        formikRegister.values.firstName,
        formikRegister.values.lastName,
        successCallback
      );
    },
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabVal(newValue);
  };

  return (
    <Container>
      <TabContext value={tabVal}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} centered>
            <Tab label="Login" value="login" />
            <Tab label="Register" value="register" />
          </TabList>
        </Box>
        <TabPanel value="login">
          <form onSubmit={formikLogin.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography variant="h4" color="primary.main">
                Login
              </Typography>
              <Typography variant="h6" color="primary.main" py="1rem">
                Sign in using your existing account.
              </Typography>
            </Box>
            <Box
              width="100%"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                color="secondary"
                value={formikLogin.values.username}
                onChange={formikLogin.handleChange}
                onBlur={formikLogin.handleBlur}
                helperText={
                  formikLogin.touched.username && formikLogin.errors.username
                }
                error={Boolean(
                  formikLogin.touched.username && formikLogin.errors.username
                )}
                sx={{ width: "45%" }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                color="secondary"
                value={formikLogin.values.password}
                onChange={formikLogin.handleChange}
                onBlur={formikLogin.handleBlur}
                helperText={
                  formikLogin.touched.password && formikLogin.errors.password
                }
                error={Boolean(
                  formikLogin.touched.password && formikLogin.errors.password
                )}
                sx={{ width: "45%" }}
              />
            </Box>
            <Box sx={{ pt: 3 }}>
              <Button
                fullWidth
                type="submit"
                disabled={formikLogin.isSubmitting}
                sx={{
                  bgcolor: "primary.main",
                  color: "#FFFFFF",
                  py: "1rem",
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
              >
                Login
              </Button>
            </Box>
          </form>
        </TabPanel>
        <TabPanel value="register">
          <form onSubmit={formikRegister.handleSubmit}>
            <Box sx={{ my: 3 }}>
              <Typography variant="h4" color="primary.main">
                Register
              </Typography>
              <Typography variant="h6" color="primary.main" py="1rem">
                Sign up for a new account.
              </Typography>
            </Box>
            <Box
              width="100%"
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <TextField
                label="Username"
                name="username"
                variant="outlined"
                color="secondary"
                value={formikRegister.values.username}
                onChange={formikRegister.handleChange}
                onBlur={formikRegister.handleBlur}
                helperText={
                  formikRegister.touched.username &&
                  formikRegister.errors.username
                }
                error={Boolean(
                  formikRegister.touched.username &&
                    formikRegister.errors.username
                )}
                sx={{ width: "45%" }}
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                variant="outlined"
                color="secondary"
                value={formikRegister.values.password}
                onChange={formikRegister.handleChange}
                onBlur={formikRegister.handleBlur}
                helperText={
                  formikRegister.touched.password &&
                  formikRegister.errors.password
                }
                error={Boolean(
                  formikRegister.touched.password &&
                    formikRegister.errors.password
                )}
                sx={{ width: "45%" }}
              />
            </Box>
            <TextField
              label="First Name"
              name="firstName"
              variant="outlined"
              color="secondary"
              value={formikRegister.values.firstName}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
              helperText={
                formikRegister.touched.firstName &&
                formikRegister.errors.firstName
              }
              error={Boolean(
                formikRegister.touched.firstName &&
                  formikRegister.errors.firstName
              )}
              fullWidth
              sx={{ mb: 3 }}
            />
            <TextField
              label="Last Name"
              name="lastName"
              variant="outlined"
              color="secondary"
              value={formikRegister.values.lastName}
              onChange={formikRegister.handleChange}
              onBlur={formikRegister.handleBlur}
              helperText={
                formikRegister.touched.lastName &&
                formikRegister.errors.lastName
              }
              error={Boolean(
                formikRegister.touched.lastName &&
                  formikRegister.errors.lastName
              )}
              fullWidth
            />

            <Box sx={{ pt: 3 }}>
              <Button
                fullWidth
                type="submit"
                disabled={formikRegister.isSubmitting}
                sx={{
                  bgcolor: "primary.main",
                  color: "#FFFFFF",
                  py: "1rem",
                  "&:hover": {
                    bgcolor: "primary.main",
                  },
                }}
              >
                Register
              </Button>
            </Box>
          </form>
        </TabPanel>
      </TabContext>
    </Container>
  );
};
