import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
axios.defaults.headers.common["api-key"] = `${process.env.API_KEY}`;

class ChannelRequestService {
    /**
     *GET channelRequest
     * @returns
     */
    getChannelRequests(jwt: string) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        const res = axios.get(`${process.env.API_URL}/channelRequest`);
        return res;
    }

    /**
     *POST channelRequest
     * @returns
     */
     createChannelRequests(jwt: string, channelId: string) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        const res = axios.post(`${process.env.API_URL}/channelRequest`, {
            channelId: channelId
        });
        return res;
    }

    /**
     *POST channelRequest/respond
     * @returns
     */
     respondChannelRequest(jwt: string, requestId: number, response: boolean) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
        const res = axios.post(`${process.env.API_URL}/channelRequest/respond`, {
            requestId: requestId,
            response: response.toString(),
        });
        return res;
    }
}
export default new ChannelRequestService();
