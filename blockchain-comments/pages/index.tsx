import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useUserContext } from "../contexts/UserContext";
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import api from "../services/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { Login } from "../components/Login";
import { HomeNav } from "../components/Nav";

type FormValues = {
  comment: string;
};

interface Comment {
  Author: string;
  Comment: string;
  ID: string;
  CreatedAt: string;
}

const Home: NextPage = () => {
  const { authenticated, loading, setLoading } = useUserContext();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[] | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      comment: "",
    },
    validationSchema: Yup.object().shape({
      comment: Yup.string()
        .max(150, "Must be 150 characters or less")
        .required("Required"),
    }),
    onSubmit: () => {
      setLoading(true);
      const successCallback = () => {
        formik.resetForm();
        setRefetch(!refetch);
        setLoading(false);
      };
      api.comment.addComment(formik.values.comment, successCallback);
    },
  });

  useEffect(() => {
    const getAllComments = async () => {
      if (authenticated) {
        setLoading(true);
        const commentsList = await api.comment.getComments();
        setComments(commentsList as Comment[]);
        setLoading(false);
      }
    };
    getAllComments();
  }, [refetch, authenticated]);

  return (
    <>
      {authenticated ? (
        <Box>
          <Backdrop
            sx={{ color: "#FFF", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress sx={{ color: "#FFF" }} />
          </Backdrop>
          <HomeNav />
          <Container sx={{ pt: 12 }}>
            <Box
              sx={{
                my: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h3"
                color="primary.main"
                sx={{ alignSelf: "flex-start" }}
              >
                Add a Comment to the Blockchain!
              </Typography>
              <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comment..."
                  name="comment"
                  variant="outlined"
                  color="secondary"
                  margin="normal"
                  value={formik.values.comment}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText={formik.touched.comment && formik.errors.comment}
                  error={Boolean(
                    formik.touched.comment && formik.errors.comment
                  )}
                />
                <Box sx={{ py: 3, width: "25%" }}>
                  <Button
                    fullWidth
                    type="submit"
                    disabled={formik.isSubmitting}
                    sx={{
                      bgcolor: "primary.main",
                      color: "#FFFFFF",
                      py: "1rem",
                      "&:hover": {
                        bgcolor: "primary.main",
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </form>
              {comments &&
                comments.map((comment) => (
                  <Box key={comment.ID} sx={{ width: "100%" }}>
                    <Divider />
                    <Typography sx={{ fontSize: "18px", mt: 3, mb: 2 }}>
                      {comment.Comment}
                    </Typography>
                    <Typography
                      sx={{
                        font: "15px Inconsolata",
                        color: "rgb(0 0 0 / 60%)",
                        mb: 3,
                      }}
                    >
                      - {comment.Author} on{" "}
                      {new Date(comment.CreatedAt).toLocaleString()}
                    </Typography>
                    <Divider />
                  </Box>
                ))}
            </Box>
          </Container>
        </Box>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Home;
