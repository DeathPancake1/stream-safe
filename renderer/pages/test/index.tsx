import { ThemeProvider } from "@emotion/react";
import theme from "../../themes/theme";
import { Box } from "@mui/material";
import SideBar from "../../components/sideBar/sideBar";
import ChannelInfo from "../channelInfo/[id]";
import AllChannelPage from "../../components/allChannelPage/allChannelPage";
import { useRouter } from "next/router";

export default function Test() {
  const router = useRouter();

  const goToChannelInfo = () => {
    const channelId = "bf275cd7-5c57-49fd-a166-11b4e6c75093";
    router.push(`/channelInfo/${channelId}`);
  };
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <AllChannelPage />

        {/* ChannelInfo({id:"d61e7a63-9363-4eae-b7e1-2619722889db"}) */}
      </Box>
    </ThemeProvider>
  );
}
