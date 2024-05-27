import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/style";
import Loader from "../components/Layout/Loader";

const AboutPage = () => {
  return (
    <>
      <div>
        <Header activeHeading={5} />
        <About />
        <Footer />
      </div>
    </>
  );
};

const About = () => {
  return (
    <section class="py-10 bg-gray-50 sm:py-16 lg:py-24">
      <div class="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
        <div class="grid items-center grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-20">
          <div>
            <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
              Engrabo MNL: Your Partner in Quality Engraving
            </h2>
            <p class="mt-4 text-base leading-relaxed text-gray-600 text-justify">
              Engrabo MNL specializes in laser engraving and cutting for wooden
              signages, souvenirs, decors, and displays. Our goal is to provide
              high-quality, affordable products for souvenirs, gifts, giveaways,
              and business branding needs.
            </p>
            <p class="mt-4 text-base leading-relaxed text-gray-600 text-justify">
              Established on January 17, 2022, Engrabo MNL is co-owned by JB and
              Jonas. JB, inspired by a successful plate printing business,
              learned the craft and, together with Jonas, transformed a side
              hustle into a full-time online business. Initially offering simple
              wedding souvenirs, Engrabo MNL has since expanded its product
              range to include a wide variety of wood and acrylic items. Within
              a year, the business established a dedicated warehouse/office to
              enhance production capabilities.
            </p>
          </div>
          <div class="relative pl-0 sm:pl-6 md:pl-0 pr-0 sm:pr-6 md:pr-0">
            <div class="relative w-full max-w-xs mt-4 mb-10 mx-auto md:ml-auto">
              <img
                class="ml-auto"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/features/1/person.jpg"
                alt=""
              />
              <img
                class="absolute -top-4 -left-12"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/features/1/wavey-lines.svg"
                alt=""
              />
              <div class="absolute -bottom-10 -left-16 sm:left-0 md:left-auto">
                <div class="bg-yellow-300">
                  <div class="px-8 py-10">
                    <span class="block text-4xl font-bold text-black lg:text-5xl">
                      Order Now
                    </span>
                    <span class="block mt-2 text-base leading-tight text-black">
                      Precision Engraving
                      <br />
                      Crafted with Care
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
