import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { userLoginApi } from "../../service/allApi";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";

function Login() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const validationRules = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^[a-zA-Z0-9@#]+$/,
  };

  const setDatas = (e) => {
    const { name, value } = e.target;
    const isValid = validationRules[name]?.test(value) ?? true;

    setErrors((prev) => ({ ...prev, [name]: !isValid }));
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { password, email } = user;

    if (!password || !email) {
      toast.warn("Please fill in all fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      const result = await userLoginApi({ email, password });
console.log("result=",result);

      if (result.status >= 200 && result.status < 300) {
        localStorage.setItem("token", result.data.token);
        setUser({ email: "", password: "" });
        navigate(`/home/${result.data._id}`);
      } else {
        toast.error(result.response?.data?.message || "Login failed", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error("Login failed", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const inputFields = [
    {
      label: 'Email Address',
      name: 'email',
      type: 'email',
      placeholder: 'name@example.com',
      errorMsg: 'Invalid Email',
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      errorMsg: 'Only alphabets, numbers, and the characters @ and # are allowed.',
    },
  ];

  return (
    <div className='mt-5 p-5'>
      <div className='container w-50 shadow-lg p-5'>
        <h2 className='text-center'>SIGN-IN</h2>
        <Form onSubmit={handleLogin}>
          <Row>
            {inputFields.map((field) => (
              <Col md={12} key={field.name} className="mb-3">
                <FloatingLabel controlId={field.name} label={field.label}>
                  <Form.Control
                    value={user[field.name]}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={setDatas}
                    isInvalid={errors[field.name]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {field.errorMsg}
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Col>
            ))}

            <Col md={12} className="text-center">
              <Button type="submit" className='btn btn-success mt-4 px-5 py-3 mb-2 rounded-pill'>
                Login
              </Button>
            </Col>

            <Col md={12} className="text-center" style={{ fontSize: '13px' }}>
              <p>Not Registered Yet? <Link to='/register'>Click Here</Link></p>
            </Col>
          </Row>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
