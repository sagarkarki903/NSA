import nsaLogo from "../assets/nsaLogo.png";
import gmailLogo from "../assets/gmailLogo.png"
import outlookLogo from "../assets/outlookLogo.png"
import { useState } from "react";




const Contact = () => {


  const [showconForm, setShowConForm] = useState(false);
 
  
  const handleContact = ()=> {
    setShowConForm(!showconForm);
  }



   const handleOutlookClick = () => {
    const recipient = "karkisa@warhawks.ulm.edu";
    window.open(
      `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(recipient)}`
    );
  };
  const handleGmailClick = () => {
    const recipient = "sagarkarki903@gmail.com";
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}`;
    
    // Open Gmail compose in a new tab
    window.open(gmailUrl, "_blank");
  };
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      {showconForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={handleContact}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Send Us a Message</h2>
           <div className="flex items-center gap-10">
            <div onClick={handleGmailClick} className="cursor-pointer">
            <img src={gmailLogo} alt="gmail Logo" className="w-8 h-6 " />
            </div>
            <div onClick={handleOutlookClick} className="cursor-pointer">
            <img src={outlookLogo} alt="outlook Logo" className="w-8 h-6 " />
            </div>
           </div>
          </div>
        </div>
      )}

       <div className="flex justify-center z-999">
                <img src={nsaLogo} alt="NSA Logo" className="w-36 h-36 rounded-full" />
              </div>
              <div className="flex flex-col items-center justify-center px-4 md:px-20 lg:px-80">
      <div className="p-4 md:p-6 rounded-lg shadow-md bg-white w-full max-w-3xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-center">Contact Us</h1>
        <p className="text-gray-600 mb-6 md:mb-8 text-center">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <div className="space-y-4 md:space-y-6">
          <div 
            className="flex items-center gap-3 cursor-pointer"  
            onClick={handleContact}
          >
            <MailIcon className="h-5 w-5 text-[#8B1818]"/>
            <span className="text-sm md:text-base">nsa@ulm.com</span>
          </div>

          <div className="flex items-center gap-3">
            <PhoneIcon className="h-5 w-5 text-[#8B1818]" />
            <span className="text-sm md:text-base">+1 (555) 000-0000</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPinIcon className="h-5 w-5 text-[#8B1818]" />
            <span className="text-sm md:text-base">700 University Avenue, Monroe, LA 71209</span>
          </div>
        </div>
      </div>
      
       
      </div>
    </div>
  );
};

export default Contact;

export const MailIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
    />
  </svg>
);

export const PhoneIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
    />
  </svg>
);

export const MapPinIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);
