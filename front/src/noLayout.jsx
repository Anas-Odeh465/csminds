import React from 'react';

const NoLayout = ({ children }) => {
  return <main className="flex-grow">{children}</main>;
};

export default NoLayout;
