import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const Login = (props) => {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  useEffect(async () => {
    const token = localStorage.getItem("jwtToken");

    if (token) {
      axios
        .get("https://go-sample-backend-production.up.railway.app/api/verify", {
          headers: {
            Authorization: "Bearer ${token}",
          },
        })
        .then((response) => {
          const userData = response.data.user;
          console.log("user data:", userData);
        })
        .catch((error) => {
          console.log("Token verification failed:", error);
          localStorage.removeItem("jwtToken");
        });
    } else {
      console.log("User is not logged in");
    }
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://go-sample-backend-production.up.railway.app/api/login",
        {
          email: email,
          password: pass,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          body: JSON.stringify({
            email,
            pass,
          }),
        }
      );

      const token = response.data.token.value;
      localStorage.setItem("jwtToken", token);

      const res = await response.data.user.name;

      console.log(response.data.user.name);
      props.setName(res);
      navigate("/");
    } catch (error) {
      const err = error.response.data.message;
      console.log(err);
      setErr(err);
    }
  };

  return (
    <div>
      <div className="container mx-auto my-24">
        <div className="flex items-center justify-center">
          <div className="flex h-[55vh] md:h-[45vh] w-[90vw] md:w-[60vw] items-center shadow-lg justify-center">
            <form onSubmit={submit} className="text-[16px] md:text-[17px]">
              <div className="flex flex-col my-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your Email"
                  className="p-2 mb-2 w-[60vw] md:w-[30vw] h-[5vh] border-2 border-gray-500 hover:border-black rounded-md"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col my-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter your Password"
                  className="p-2 w-[60vw] md:w-[30vw] h-[5vh] border-2 border-gray-500 hover:border-black rounded-md"
                  onChange={(e) => setPass(e.target.value)}
                />
              </div>

              <div className="flex flex-col items-center justify-evenly h-[18vh] mt-6">
                <span className="font-bold">{err}</span>
                <button className="w-20 h-10 rounded-lg bg-green-600 hover:bg-green-700 text-white hover:text-gray-300 font-bold mt-2 ease-in duration-150 ">
                  Sign in
                </button>
                <span className="text-[14px]">
                  Don't have an account? Sign up{" "}
                  <Link
                    to="/register"
                    className="ease-out duration-100 hover:underline hover:text-red-400"
                  >
                    Here
                  </Link>
                  !
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
