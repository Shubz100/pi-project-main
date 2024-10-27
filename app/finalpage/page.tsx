import React from 'react';
import Link from 'next/link';

const FinalPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="w-full bg-[#670773] text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Pi Trader</h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center text-center">
        {/* Verification Icon */}
        <div className="w-32 h-32 mb-8 text-[#670773] animate-scale-in">
          <div className="relative">
            <i className="fas fa-circle text-[#670773] text-8xl"></i>
            <i className="fas fa-check absolute text-white text-5xl" style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}></i>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="space-y-4 max-w-md animate-fade-in">
          <p className="text-xl font-semibold text-[#670773]">
            Thank you for doing a transaction with Pi Traders
          </p>
          
          <p className="text-gray-600">
            The payment process may take 5-8hrs. Wait patiently
          </p>

          <p className="text-gray-600">
            You can check transaction status in menu &gt; Transaction History
          </p>
        </div>

        {/* Return Button */}
        <Link href="/" className="mt-12">
          <button className="bg-[#670773] text-white px-8 py-3 rounded-full font-bold text-lg 
            shadow-lg hover:bg-[#7a1b86] transform hover:scale-105 transition-all duration-300 
            animate-slide-up">
            Return to Home Screen
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards 0.3s;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards 0.6s;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default FinalPage;
