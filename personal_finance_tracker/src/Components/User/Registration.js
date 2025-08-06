import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { userRegistrationApi } from './../../service/allApi';
import { Button, Col, FloatingLabel, Row, Form } from "react-bootstrap";

function Registration() {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        username: false,
        email: false,
        password: false,
    });

    const validationRules = {
        username: /^[a-zA-Z .]+$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        password: /^[a-zA-Z0-9@#]+$/,
    };

    const setDatas = (e) => {
        const { name, value } = e.target;
        const isValid = validationRules[name]?.test(value) ?? true;

        setErrors((prev) => ({ ...prev, [name]: !isValid }));
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        const { username, email, password } = user;

        if (!username || !email || !password) {
            toast.warn("Please fill all fields", {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        try {
            const result = await userRegistrationApi(user);

            if (result.status >= 200 && result.status < 300) {
                localStorage.setItem("user", JSON.stringify({ username, email, password }));
                toast.success("User Registered Successfully", {
                    position: "top-center",
                    autoClose: 3000
                });

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                toast.error(result.response?.data?.message || "Registration Failed", {
                    position: "top-center",
                    autoClose: 3000
                });
            }
        } catch (err) {
            toast.error("Something went wrong!", {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    const inputFields = [
        { label: 'Username', name: 'username', type: 'text', placeholder: 'Username', errorMsg: 'Invalid Username' },
        { label: 'Email Address', name: 'email', type: 'email', placeholder: 'name@example.com', errorMsg: 'Invalid Email' },
        {
            label: 'Password',
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            errorMsg: 'Only alphabets, numbers, and the characters @ and # are allowed.'
        },
    ];

    return (
        <div className='mt-5 p-5'>
            <div className='container w-50 shadow-lg p-5'>
                <h2 className='text-center'>SIGN-UP</h2>
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
                                />
                            </FloatingLabel>
                            {errors[field.name] && <p className="text-danger">{field.errorMsg}</p>}
                        </Col>
                    ))}

                    <Col md={12} className="text-center">
                        <Button onClick={handleRegister} className='btn btn-success mt-4 px-5 py-3 mb-2 rounded-pill'>
                            Register
                        </Button>
                    </Col>

                    <Col md={12} className="text-center" style={{ fontSize: '13px' }}>
                        <p>Already registered? <Link to='/login'>Click Here</Link></p>
                    </Col>
                </Row>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Registration;