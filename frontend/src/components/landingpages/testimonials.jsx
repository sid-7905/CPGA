import React from "react";

const testimonials = [
  {
    name: "Jaiden Lee",
    handle: "@buildjaiden",
    text: "It practically solves every issue I have with Webflow and Framer. This is so much easier to use as a developer!",
  },
  {
    name: "James Q Quick",
    handle: "@jamesqquick",
    text: "This looks really freaking cool!",
  },
  {
    name: "Wayne",
    handle: "@wayne_dev",
    text: "Absolutely love Reweb! Such a game-changer for building beautiful landing pages effortlessly.",
  },
  {
    name: "shadcn",
    handle: "@shadcn",
    text: "Amazing.",
  },
  {
    name: "soumyadotdev",
    handle: "@geekysrm",
    text: "This is awesome. Better than Framer/Wordpress as you can take the code and continue working on it instantly yourself.",
  },
  {
    name: "Mike Knapp",
    handle: "@mikeee",
    text: "This is super cool! Very easy to use, and better than trying to mock things up in Figma.",
  },
  {
    name: "Ninjanordbo",
    handle: "@ninjanordbo",
    text: "I really have been missing this product for years. It feels like a much more natural way of working.",
  },
  {
    name: "Kabir Asani",
    handle: "@KabirAsani",
    text: "This is so tastefully built. Loving it.",
  },
  {
    name: "Paul Bratslavsky",
    handle: "@codingthirty",
    text: "This is my new favorite way of building projects quickly.",
  },
];

const Testimonials = () => {
  return (
    <div className=" bg-gradient-to-t from-gray-[#1B2432] to-gray-800 flex flex-col justify-evenly items-center">  
    <h1 className="text-3xl text-white font-bold mb-4">What people are saying</h1>
    <p className="mb-8 text-gray-300">Thousands of developers and teams love Reweb.</p>
      <div className=" text-white p-8 w-4/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-b to-gray-800 from-gray-900 p-4 rounded"
            >
              <p className="mb-2">{testimonial.text}</p>
              <p className="font-bold text-cyan-400">{testimonial.name}</p>
              <p className="text-cyan-200">{testimonial.handle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
