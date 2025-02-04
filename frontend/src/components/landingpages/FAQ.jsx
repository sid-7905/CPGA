import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is CPGA?",
      answer: "CPGA (Competitive Programming Guide and Analyzer) is a platform designed to help users analyze their competitive programming progress. It provides guidance from an AI bot on problem topics and difficulty levels, and suggests daily problems based on the user's skill level."
    },
    {
      question: "How do I track my CP progress?",
      answer: "You can track your competitive programming progress through graphical analysis provided by the platform. The analysis includes metrics such as solved problems, difficulty levels, and performance over time."
    },
    {
      question: "How can I resolve my CP-related doubts?",
      answer: "CPGA offers a discussion page where you can resolve your doubts by interacting with the community."
    },
    {
      question: "How are the daily problems suggested?",
      answer: "The platform suggests daily problems based on your selected preferences and rating range. This helps you stay motivated and steadily improve your competitive programming skills."
    },
    {
      question: "How can I contribute to the CPGA community?",
      answer: "You can contribute by answering questions, sharing insights, or suggesting improvements on the platform. We encourage active participation from all users to create a collaborative learning environment."
    }
  ];

return (
    <main id='faqs' className="p-5">
        <div className="flex flex-col justify-center items-center my-2">
          <h1 className="text-4xl font-semibold text-cyan-400 mb-4">Frequently Asked Questions</h1>
            <div className="w-full sm:w-10/12 md:w-1/2 my-1">
                
                <ul className="flex flex-col">
                    {faqData.map((faq, index) => (
                        <li key={index} className="bg-gradient-to-b to-gray-900 from-gray-600 my-2 shadow-lg rounded-xl">
                            <h2
                                onClick={() => handleClick(index)}
                                className="flex flex-row justify-between items-center font-semibold p-3 cursor-pointer"
                            >
                                <span className='text-gray-200 text-lg'>{faq.question}</span>
                                <svg
                                    className={`fill-current text-cyan-400 h-6 w-6 transform transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M13.962,8.885l-3.736,3.739c-0.086,0.086-0.201,0.13-0.314,0.13S9.686,12.71,9.6,12.624l-3.562-3.56C5.863,8.892,5.863,8.611,6.036,8.438c0.175-0.173,0.454-0.173,0.626,0l3.25,3.247l3.426-3.424c0.173-0.172,0.451-0.172,0.624,0C14.137,8.434,14.137,8.712,13.962,8.885 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.148,17.521,17.521,14.147,17.521,10"></path>
                                </svg>
                            </h2>
                            <div
                                className={`border-l-2 border-cyan-600 overflow-hidden ${activeIndex === index ? 'max-h-full' : 'max-h-0'}`}
                            >
                                <p className="p-3 text-cyan-400 transition-max-height ease-in-out">{faq.answer}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </main>
);
};

export default FAQ;
