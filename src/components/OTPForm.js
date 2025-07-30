import { useState, useEffect } from "react";
import axios from "axios";
import "./OtpForm.css";

function OtpForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const [resendTimer, setResendTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [resendTimer]);

  const sendOtp = async () => {
    if (!email) {
      setMessage("Please enter a valid email");
      return;
    }

    setIsSending(true);
    try {
      const res = await axios.post("http://localhost:5000/send-otp", { email });
      setMessage(res.data.message);
      setResendTimer(30); // Disable resend for 30 seconds
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      setIsSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/verify-otp", { email, otp });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error verifying OTP");
    }
  };

  return (
    <div className="otp-container">
      <h2 className="otp-heading">OTP Verification</h2>

      <div className="input-group">
        <label>Email:</label>
        <input
          type="email"
          className="otp-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
      </div>

      <button className="otp-button" onClick={sendOtp} disabled={isSending || resendTimer > 0}>
        {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Send OTP"}
      </button>

      <div className="input-group">
        <label>Enter OTP:</label>
        <input
          type="text"
          className="otp-input"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit OTP"
          required
        />
      </div>

      <button className="otp-button" onClick={verifyOtp}>Verify OTP</button>

      {message && (
        <p className="otp-message">{message}</p>
      )}
    </div>
  );
}

export default OtpForm;
