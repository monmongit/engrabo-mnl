import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/style";

const FAQPage = () => {
  return (
    <>
      <div>
        <Header activeHeading={5} />
        <Faq />
        <Footer />
      </div>
    </>
  );
};

const Faq = () => {
  const faqData = [
    {
      question: "How to order?",
      details: [
        "Browse products, add to cart, review, proceed to checkout, enter shipping details, select payment method, place the order, and receive a confirmation email.",
      ],
    },
    {
      question: "How to request a refund?",
      details: [
        "Log in, go to 'My Orders', select the order, request a refund, provide a reason, and await support team's review (3-5 business days).",
      ],
    },
    {
      question: "What are your policies?",
      details: [
        "Return products within 30 days, refunds processed in 7-10 business days, shipping options vary by location and weight, and privacy policies protect personal information.",
      ],
    },
    {
      question: "How to manage my account?",
      details: [
        "Steps to create, activate, update profile information, change password, view orders, and saved addresses.",
      ],
    },
    {
      question: "How to track my order?",
      details: [
        "Log in, go to 'My Orders', select the order, and view status and tracking info.",
      ],
    },
    {
      question: "How to manage products?",
      details: [
        "Instructions on adding products to wishlist or cart, customizing designs, and searching for products.",
      ],
    },
    {
      question: "What are the viewing options?",
      details: [
        "See all categories, best deals, featured products, product availability, product details, and events.",
      ],
    },
    {
      question: "What are the delivery times?",
      details: [
        "Standard (5-7 business days), Express (2-3 business days), and International (10-15 business days).",
      ],
    },
    {
      question: "How to use live chat?",
      details: [
        "Directly connect with admin via a clickable live chat button.",
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab === tab) {
      setActiveTab(0);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className={`${styles.section} my-8`}>
      <h2 className="text-3xl font-bold text-[#171203] mb-8">FAQ</h2>
      <div className="mx-auto space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-[#b19b56] pb-4">
            <button
              className="flex items-center justify-between w-full"
              onClick={() => toggleTab(index + 1)}
            >
              <span className="text-lg font-medium text-[#171203]">
                {item.question}
              </span>
              {activeTab === index + 1 ? (
                <svg
                  className="h-6 w-6 text-[#534723]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-[#534723]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
            {activeTab === index + 1 && (
              <div className="mt-4">
                {item.details.map((detail, detailIndex) => (
                  <p
                    key={detailIndex}
                    className="text-base text-[#534723] text-justify"
                  >
                    {detail}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;
