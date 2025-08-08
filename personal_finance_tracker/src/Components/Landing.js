import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import icon from '../Components/User/Images/Icon.png';

function Landing() {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-primary-subtle text-center">
      <h1 className="d-flex align-items-center justify-content-center flex-wrap">
        Welcome to
        <span className="d-inline-flex align-items-center">
          <img src={icon} alt="Logo" className='landing_img'/>
          <span className="text-warning">BUDGET BOARD</span>
        </span>
      </h1>
      <div className="mb-4 text-primary fs-4">Please sign in or create an account</div>
      <div>
        <Link to="/login">
          <Button variant="dark" size="lg" className="me-4">Login</Button>
        </Link>
        <Link to="/register" className="me-2">
          <Button variant="outline-dark" size="lg">Register</Button>
        </Link>
      </div>
    </div>
  );
}

export default Landing;
