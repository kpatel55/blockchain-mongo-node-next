import {
  AppBar,
  Box,
  Button,
  Slide,
  styled,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import _ from "lodash";
import { ReactElement, useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import api from "../services/api";

type Props = {
  window?: () => Window;
  children: ReactElement;
};

function HiddenNav(props: Props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const HomeNavRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#e44c50",
  color: "#FFF",
  boxShadow: "none",
  display: "flex",
  padding: "5px 0",
  zIndex: 500,
  //   backdropFilter: "blur(0.125rem)",
}));

export const HomeNav = () => {
  const { currentUser, setAuthenticated } = useUserContext();

  const handleClick = () => {
    api.user.logout();
    setAuthenticated(false);
  };

  return (
    <>
      <HiddenNav>
        <Box>
          <HomeNavRoot position="fixed">
            <Toolbar disableGutters sx={{ px: "3.6%" }}>
              <Typography variant="h5" color="#FFF" sx={{ flex: 1 }}>
                {currentUser?.username}
              </Typography>
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
            </Toolbar>
          </HomeNavRoot>
        </Box>
      </HiddenNav>
    </>
  );
};
