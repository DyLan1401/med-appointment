import axios from "axios";  

export default function Login() {
  const handleGoogleLogin = async () => {
    const res = await axios.get("http://localhost:8000/api/auth/google/redirect");
    window.location.href = res.data.url;
  };

  const handleFacebookLogin = async () => {
    const res = await axios.get("http://localhost:8000/api/auth/facebook/redirect");
    window.location.href = res.data.url;
  };

  return (
    <>
      <Navbar />
      <Formlogin />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleGoogleLogin} className="btn btn-danger">
          Đăng nhập bằng Google
        </button>
        <button onClick={handleFacebookLogin} className="btn btn-primary" style={{ marginLeft: 10 }}>
          Đăng nhập bằng Facebook
        </button>
      </div>
    </>
  );
}
