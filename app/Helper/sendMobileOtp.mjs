import axios from "axios";

export async function sendMobileOtp(mobile, otp) {
  const url = "https://japi.instaalerts.zone/httpapi/JsonReceiver";

  const payload = {
    ver: "1.0",
    key: "ht0Mf3HcjMCgCKgiuHj0bg==",
    messages: [
      {
        dest: [mobile], // mobile number with country code
        text: `${otp} is your OTP to verify your mobile number. Please do not share it with anyone. - International Travel House`,
        send: "TRVLHS",
        type: "PM",
        dlt_entity_id: "1001413500000012232",
        dlt_template_id: "1007624361247948764"
      }
    ]
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("SMS API Response:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error.response?.data || error.message);
  }
}
