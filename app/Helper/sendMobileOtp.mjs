import axios from "axios";

export const sendMobileOtp = async (mobile, otp) => {
    try {
        const username = "TRVLHS";
        const password = "ITH#app1";
        const auth = Buffer.from(`${username}:${password}`).toString("base64");

        const payload = {
            messages: [
                {
                    channel: "sms",
                    sender: "TRVLHS",
                    recipient: "91" + mobile,
                    content: `${otp} is your OTP so verify your mobile number. Please do not share It with anyone,- International Travel House`,
                    template_id: "1007624361247948764"
                }
            ]
        };

        console.log("Sending payload:", payload);

        const response = await axios.post("https://api.karix.com/messages", payload, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${auth}`
            }
        });

        console.log("Karix Response:", response.data);
        console.log("Mobile OTP sent successfully.");
    } catch (error) {
        console.error("Karix API Error:", error.response?.data || error.message);
    }
};
