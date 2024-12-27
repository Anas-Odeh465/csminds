import React from 'react';
import NavigationBar from './components/Layout/navBar';
import Footer from './components/Layout/footer';

const DefaultLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
        
      {/* NavigationBar */}
      <NavigationBar />

     
      <main className="flex-grow">

        {/* Main Content */}
        {children}

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DefaultLayout;