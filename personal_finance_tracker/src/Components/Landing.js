import React from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      <Link to='/register'>
        <Button> Register </Button>
      </Link>
      <Link to='/login'>

        <Button> Login </Button>
      </Link>
    </div>
  )
}

export default Landing
