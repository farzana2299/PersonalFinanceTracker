import { Button, Container, Navbar, Nav, ButtonGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import TransactionList from './Transaction/TransactionList/TransactionList';
import { useState } from 'react';

function Home() {

const { id } = useParams();

    const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', component: <Dashboard uid={id} /> },
    { key: 'transaction', label: 'Transaction', component: <TransactionList uid={id}/> },
  ];

  const renderTabComponent = () => {
    const tab = tabs.find(t => t.key === activeTab);
    return tab ? tab.component : null;
  };
  return (
    <div>
      {/* Navbar */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <img
              alt="Logo"
              src="/img/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top me-2"
            />
            React Bootstrap
          </Navbar.Brand>

          <Nav className="ms-auto">
              <Link to={'/'}>
                  <Button onClick={()=>{localStorage.clear()}} className="btn" variant="outline-danger" type="submit">Logout</Button>
                </Link>
          </Nav>
        </Container>
      </Navbar>

      {/* home Page  */}
      <Container className="pt-4 pb-5">

        <div className="d-flex justify-content-center mb-4">
          <ButtonGroup>
            {tabs.map(tab => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'success' : 'outline-success'}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <div>{renderTabComponent()}</div>

      </Container>
    </div>
  );
}

export default Home;