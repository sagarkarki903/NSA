import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto w-full">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} Nepalese Student Association at ULM</p>
        <p className="text-sm">
          Contact us: <a href="mailto:sagarajan@gmail.com" className="underline text-gray-300">nsaulm2k16@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;