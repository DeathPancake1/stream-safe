import React, { useEffect, useState } from "react";
import theme from "../../themes/theme";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Search, Groups, Settings, HelpOutline } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import icon from "../../../resources/icon.ico";
import secureLocalStorage from "react-secure-storage";
import { useUser } from "../../providers/UserContext";
import { useRouter } from "next/router";
import { useHomeLogic } from "../../helpers/logicHooks/Home/HomeLogic";

interface Props {
  childrenFunction: any;
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
}

export default function SideBar(props: Props) {
  const [initialMouseX, setInitialMouseX] = useState<number>(0);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const { userData, updateUser } = useUser();
  const [display, setDisplay] = useState<string>("none");
  const [selectedItem, setSelectedItem] = useState<string>("Explore");

  const handleMouseDown = (event) => {
    setInitialMouseX(event.clientX);
    setIsResizing(true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  const handleMouseMove = (event) => {
    if (isResizing) {
      const deltaX = initialMouseX - event.clientX;
      const newWidth = Math.min(Math.max(props.width - deltaX, 290), 700); // Adjust minimum width as needed
      props.setWidth(newWidth);
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const router = useRouter();

  const logout = () => {
    secureLocalStorage.removeItem("jwt");
    updateUser("", "");
    router.push("/login");
  };

  useEffect(() => {
    if (userData.email === "") {
      setDisplay("none");
      props.setWidth(0);
    } else {
      setDisplay("block");
      props.setWidth(290);
    }
  }, [userData.email]);

  useHomeLogic();

  const handleItemClick = (text) => {
    if (text === "Logout") {
      logout();
    } else if (text === "My Channels") {
      router.push(`/myChannels`);
    }
    setSelectedItem(text);
  };

  return (
    <Box sx={{ display: `${display}` }}>
      <Drawer
        variant="permanent"
        open={true}
        sx={{
          width: `${props.width}px`,
          "& .MuiDrawer-paper": {
            width: `${props.width}px`,
            backgroundColor: theme.palette.primary.main,
            padding: "0.5rem",
            height: "100vh",
            overflow: "auto",
            margin: "0px",
          },
        }}
      >
        <List
          sx={{ height: "100vh", display: "flex", flexDirection: "column" }}
        >
          <ListItem sx={{ m: "2rem 0px 1.25rem 0px" }}>
            <ListItemIcon>
              <img
                style={{ width: "50px", height: "50px" }}
                src={icon.src}
                alt="ds"
              />
            </ListItemIcon>
            <ListItemText
              style={{ color: theme.palette.secondary.main }}
              primary={<Typography variant="h4">Stream Safe</Typography>}
            />
          </ListItem>
          <Divider
            variant="middle"
            sx={{ background: theme.palette.secondary.main, mb: "0.7rem" }}
          />
          {["Explore", "My Channels", "Logout"].map((text) => (
            <ListItem
              key={text}
              disablePadding
              sx={{
                backgroundColor: selectedItem === text ? "white" : "inherit",
              }}
              onClick={() => handleItemClick(text)}
            >
              <ListItemButton
                sx={{
                  color:
                    selectedItem === text
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                  backgroundColor: selectedItem === text ? theme.palette.secondary.main : theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: "White",
                    color: theme.palette.primary.main,
                    "&, & .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      selectedItem === text
                        ? theme.palette.primary.main
                        : "White",
                  }}
                >
                  {(() => {
                    switch (text) {
                      case "Explore":
                        return <Search />;
                      case "My Channels":
                        return <Groups />;
                      case "Settings":
                        return <Settings />;
                      case "Logout":
                        return <LogoutIcon />;
                      default:
                        return null;
                    }
                  })()}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontSize: "1.25rem" }}>{text}</Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <ListItem disablePadding sx={{ alignSelf: "flex-end" }}>
              <ListItemButton>
                <ListItemIcon>
                  <HelpOutline color="secondary" />
                </ListItemIcon>
                <ListItemText
                  style={{ color: theme.palette.secondary.main }}
                  primary={
                    <Typography sx={{ fontSize: "1.25rem" }}>Help</Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </Box>
        </List>
        <div
          onMouseDown={handleMouseDown}
          style={{
            width: "1px",
            cursor: "ew-resize",
            padding: "4px 0 0",
            borderTop: "1px solid #ddd",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            backgroundColor: "black",
          }}
        />
      </Drawer>
    </Box>
  );
}
