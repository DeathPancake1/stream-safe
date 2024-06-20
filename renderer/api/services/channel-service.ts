import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();
axios.defaults.headers.common["api-key"] = `${process.env.API_KEY}`;

class ChannelService {
    /**
     *POST channel/createChannel
     * @returns
     */

    async createChannel(data: {
        title: string;
        description: string;
        private: boolean;
        jwt: string;
        thumbnailPhoto: File;
    }) {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("private", data.private.toString()); // convert boolean to string
            formData.append("thumbnailPhoto", data.thumbnailPhoto);

            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;

            const res = await axios.post(
                `${process.env.API_URL}/channel/createChannel`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }

    /**
     *POST channel/addMember
     * @returns
     */
    async addMember(data: {
        channelId: string;
        newMember: string;
        jwt: string;
    }) {
        try {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;
            const res = await axios.post(
                `${process.env.API_URL}/channel/addMember`,
                {
                    channelId: data.channelId,
                    newMemberEmails: data.newMember,
                }
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }

    /**
     *POST channel/removeMember
     * @returns
     */
     async removeMember(data: {
        channelId: string;
        oldMember: string;
        jwt: string;
    }) {
        try {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;
            const res = await axios.post(
                `${process.env.API_URL}/channel/removeMember`,
                {
                    channelId: data.channelId,
                    oldMemberEmail: data.oldMember,
                }
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }

    /**
     *POST channel/exchangeChannelKey
     * @returns
     */
     async exchangeChannelKey(data: {
        channelId: string;
        email: string;
        key: string
        jwt: string;
    }) {
        try {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;
            const res = await axios.post(
                `${process.env.API_URL}/channel/exchangeChannelKey`,
                {
                    channelId: data.channelId,
                    receiverEmail: data.email,
                    key: data.key
                }
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }

    /**
     *POST channel/getMessagesFromChannel
     * @returns
     */
    async getMessagesFromChannel(data: { jwt: string }) {
        try {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;
            const res = await axios.get(
                `${process.env.API_URL}/channelFiles/getMessagesFromChannel`,
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }

    /**
     *POST channel/getMembers
     * @returns
     */
    async getMembers(data: { channelId: string; jwt: string }) {
        try {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;
            const res = await axios.post(
                `${process.env.API_URL}/channel/getMembers`,
                {
                    channelId: data.channelId,
                }
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }

    /**
     *POST channel/getMembers
     * @returns
     */
    async getChannelInfoById(data: { channelId: string; jwt: string }) {
        try {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;
            const res = await axios.post(
                `${process.env.API_URL}/channel/getChannelInfoById`,
                {
                    id: data.channelId,
                }
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }

    /**
     *POST channel/searchAllChannels
     * @returns
     */
    async searchAllChannels(data: { jwt: string; name: string }) {
        try {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;
            const res = await axios.post(
                `${process.env.API_URL}/channel/searchAllChannels`,
                { title: data.name }
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }

    /**
     *POST channel/checkIfMember
     * @returns
     */
     async checkIfMember(data: { channelId: string; jwt: string }) {
        try {
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${data.jwt}`;
            const res = await axios.post(
                `${process.env.API_URL}/channel/checkIfMember`,
                {
                    id: data.channelId,
                }
            );
            return res;
        } catch (error) {
            return {
                status: 401,
                data: "",
            };
        }
    }
}

export default new ChannelService();
