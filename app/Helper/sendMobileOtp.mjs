import axios from "axios";

export async function sendMobileOtp(mobile, otp) {
  const url = "https://japi.instaalerts.zone/httpapi/JsonReceiver";

  // Base64("TRVLHS:ITH#app1")
  const basicAuth = "Basic VFJWTEhTOklUSCNhcHAx";

  const payload = {
    ver: "1.0",
    key: "ht0Mf3HcjMCgCKgiuHj0bg==",
    encrpt: "0",
    sch_at: "",
    messages: [
      {
        dest: [mobile],               // dynamic mobile number
        type: "SI",
        country_cd: "91",
        app_country: "1",
        dlt_entity_id: "1001413500000012232",
        dlt_template_id: "1007624361247948764",
        template_values: [otp],       // dynamic OTP
        senderid: "TRVLHS",
        dcs: "0",
        udhi_inc: "0",
        port: "0",
        vp: "15"
      }
    ]
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth
      }
    });

    return response.data; // return result to caller
  } catch (error) {
    throw error.response?.data || error.message;
  }
}
