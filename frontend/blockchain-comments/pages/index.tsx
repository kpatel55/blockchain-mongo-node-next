import type { NextPage } from "next";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../utils/Link";
import { useUserContext } from "../contexts/UserContext";
import { useRouter } from "next/router";
import { Button, Divider, TextField } from "@mui/material";
import api from "../services/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { string } from "yup/lib/locale";

type FormValues = {
  comment: string;
};

interface Comment {
  Author: string;
  Comment: string;
  ID: string;
}

const Home: NextPage = () => {
  const { authenticated, setLoading } = useUserContext();
  const [refetch, setRefetch] = useState<boolean>(false);
  const router = useRouter();
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
      };
      api.comment.addComment(formik.values.comment, successCallback);
    },
  });

  useEffect(() => {
    if (!authenticated) {
      router.push("/login");
    }
  }, [authenticated]);

  useEffect(() => {
    const getAllComments = async () => {
      const commentsList = await api.comment.getComments();
      setComments(commentsList as Comment[]);
    };
    getAllComments();
  }, [refetch]);

  const handleClick = () => {
    api.user.logout();
    router.push("/login");
  };

  return (
    <Container maxWidth="lg">
      {authenticated && (
        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleClick}
            sx={{
              bgcolor: "#000",
              color: "#FFF",
              mx: 5,
              fontSize: "11px",
              "&:hover": {
                bgcolor: "#2b2626",
                color: "#FFF",
              },
            }}
          >
            Log out
          </Button>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Store a comment on the blockchain"
              name="comment"
              variant="outlined"
              color="secondary"
              margin="normal"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              helperText={formik.touched.comment && formik.errors.comment}
              error={Boolean(formik.touched.comment && formik.errors.comment)}
            />
            <Box sx={{ py: 3 }}>
              <Button
                fullWidth
                type="submit"
                disabled={formik.isSubmitting}
                sx={{
                  bgcolor: "rgb(0, 0, 0)",
                  py: "1rem",
                  "&:hover": {
                    bgcolor: "rgb(0, 0, 0)",
                  },
                }}
              >
                Submit
              </Button>
            </Box>
          </form>
          {comments &&
            comments.map((comment) => (
              <Box key={comment.ID}>
                <Divider />
                <Typography>
                  {comment.Comment} by {comment.Author}
                </Typography>
                <Divider />
              </Box>
            ))}
        </Box>
      )}
    </Container>
  );
};

export default Home;
