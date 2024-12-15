import React from 'react';

const Button = ({ onClick, children }) => (
  <button onClick={onClick} style={{ padding: '10px 20px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px' }}>
    {children}
  </button>
);

export default Button;