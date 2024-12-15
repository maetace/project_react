import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => (
  <div>
    <h1>Welcome to My React App</h1>
    <Link to="/weather">
      <Button>Go to Weather</Button>
    </Link>
  </div>
);

export default Home;