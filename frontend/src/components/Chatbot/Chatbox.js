import React, { useState, useEffect, useRef } from 'react';
import styles from '../../styles/style';
import { RiRobot2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { server } from '../../server';
import { RxCross1 } from 'react-icons/rx';

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showCloudMessage, setShowCloudMessage] = useState(false);
  const [unknownMessageCount, setUnknownMessageCount] = useState(0);
  const [greetingAdded, setGreetingAdded] = useState(false);
  const [language, setLanguage] = useState('english');
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) {
        setShowCloudMessage((prev) => !prev);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleButtonClick = async () => {
    if (isAuthenticated) {
      const groupTitle = 'some_group_title' + user._id;
      const userId = user._id;
      const adminId = '663ee28b8bf73dea6eeb877a';

      try {
        const res = await axios.post(
          `${server}/conversation/create-new-conversation`,
          {
            groupTitle,
            userId,
            adminId,
          }
        );
        navigate(`/inbox?${res.data.conversation._id}`);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    } else {
      toast.error('Please login to start a conversation');
    }
  };

  const userName = isAuthenticated ? user.name.split(' ')[0] : 'Dear customer';

  const faqResponses = {
    english: {
      'How to order?': (
        <>
          Hi {userName}, to place an order, follow these steps:
          <br />
          1. Browse through our categories and select the products you want.
          <br />
          2. Click 'Add to Cart' on the product page.
          <br />
          3. Once you've added all the desired items to your cart, click on the
          cart icon at the top right corner.
          <br />
          4. Review your cart and click 'Proceed to Checkout'.
          <br />
          5. Enter your shipping details and choose a payment method.
          <br />
          6. Review your order and click 'Place Order'.
          <br />
          You will receive a confirmation email with the order details.
        </>
      ),
      'How to refund?': (
        <>
          Hi {userName}, to request a refund, please follow these steps:
          <br />
          1. Log in to your account.
          <br />
          2. Go to 'My Orders' in your profile dashboard.
          <br />
          3. Select the order you want to refund.
          <br />
          4. Click 'Request Refund' and provide a reason for the refund.
          <br />
          5. Our support team will review your request and contact you within
          3-5 business days.
          <br />
          You will be notified via email about the status of your refund
          request.
        </>
      ),
      'What are your policies?': (
        <>
          Hi {userName}, our policies are as follows:
          <br />
          1. <strong>Return Policy</strong>: You can return products within 30
          days of delivery. The items must be in their original condition.
          <br />
          2. <strong>Refund Policy</strong>: Refunds are processed within 7-10
          business days after the returned items are received and inspected.
          <br />
          3. <strong>Shipping Policy</strong>: We offer standard and express
          shipping options. Shipping charges are calculated based on your
          location and the weight of the package.
          <br />
          4. <strong>Privacy Policy</strong>: We value your privacy and ensure
          that your personal information is protected. For more details, visit
          our Privacy Policy page.
        </>
      ),
      'Live chat': (
        <span>
          Hi {userName}, thank you for reaching out to the admin. Just click
          this{' '}
          <button
            className="bg-[#78683a96] p-2 mr-2 rounded-lg cursor-pointer hover:bg-[#171203] hover:text-[#fff] whitespace-nowrap"
            onClick={handleButtonClick}
          >
            Live Chat
          </button>{' '}
          to send a message.
        </span>
      ),
      'How to create and activate an account?': (
        <>
          Hi {userName}, to create and activate an account:
          <br />
          1. Click on the 'Sign Up' button at the top right corner of the page.
          <br />
          2. Fill in the required details such as your name, email, and
          password.
          <br />
          3. Click 'Register' and you will receive an activation email.
          <br />
          4. Open the email and click on the activation link to activate your
          account.
          <br />
          5. You can now log in with your credentials.
        </>
      ),
      'How to update profile information?': (
        <>
          Hi {userName}, to update your profile information:
          <br />
          1. Log in to your account.
          <br />
          2. Go to 'My Profile' from the dashboard.
          <br />
          3. Click 'Edit Profile' and update the necessary details.
          <br />
          4. Click 'Save' to update your information.
        </>
      ),
      'How to change the password?': (
        <>
          Hi {userName}, to change your password:
          <br />
          1. Log in to your account.
          <br />
          2. Go to 'My Profile' and click on 'Change Password'.
          <br />
          3. Enter your current password and the new password.
          <br />
          4. Click 'Save' to update your password.
        </>
      ),
      'How to see all my orders?': (
        <>
          Hi {userName}, to view all your orders:
          <br />
          1. Log in to your account.
          <br />
          2. Go to 'My Orders' from the dashboard.
          <br />
          3. You will see a list of all your orders with their status.
        </>
      ),
      'How to see my addresses?': (
        <>
          Hi {userName}, to view your saved addresses:
          <br />
          1. Log in to your account.
          <br />
          2. Go to 'My Addresses' from the dashboard.
          <br />
          3. You will see a list of all your saved addresses and you can add or
          edit addresses here.
        </>
      ),
      'How to track my order status?': (
        <>
          Hi {userName}, to track your order status:
          <br />
          1. Log in to your account.
          <br />
          2. Go to 'My Orders' from the dashboard.
          <br />
          3. Click on the order you want to track.
          <br />
          4. You will see the current status and tracking information.
          <br />
          5. You will also receive email updates as your order status changes.
        </>
      ),
      'How to add a product to wishlist?': (
        <>
          Hi {userName}, to add a product to your wishlist:
          <br />
          1. Browse through our products and select the one you like.
          <br />
          2. Click on the 'Add to Wishlist' button on the product page.
          <br />
          3. You can view your wishlist by going to 'My Wishlist' from your
          profile dashboard.
        </>
      ),
      'How to add a product to cart?': (
        <>
          Hi {userName}, to add a product to your cart:
          <br />
          1. Browse through our products and select the one you want to buy.
          <br />
          2. Click on the 'Add to Cart' button on the product page.
          <br />
          3. You can view your cart by clicking on the cart icon at the top
          right corner of the page.
        </>
      ),
      'How to check out?': (
        <>
          Hi {userName}, to check out:
          <br />
          1. Click on the cart icon at the top right corner of the page.
          <br />
          2. Review the items in your cart and click 'Proceed to Checkout'.
          <br />
          3. Enter your shipping details and select a payment method.
          <br />
          4. Review your order and click 'Place Order'.
          <br />
          5. You will receive a confirmation email with your order details and
          receipt.
        </>
      ),
      'How to create my own design?': (
        <>
          Hi {userName}, to create your own design:
          <br />
          1. Select a product that offers customization, like our engraving
          items.
          <br />
          2. Click on the 'Customize' button on the product page.
          <br />
          3. Use our design tool to add your text or design.
          <br />
          4. Preview your design and click 'Add to Cart' once you are satisfied.
          <br />
          5. Proceed to checkout as usual.
        </>
      ),
      'How to search for a product?': (
        <>
          Hi {userName}, to search for a product:
          <br />
          1. Use the search bar at the top of the page.
          <br />
          2. Enter the product name or keywords and press 'Enter'.
          <br />
          3. Browse through the search results to find your desired product.
        </>
      ),
      'How to see all product categories?': (
        <>
          Hi {userName}, to view all product categories:
          <br />
          1. Click on the 'Categories' tab at the top of the page.
          <br />
          2. Browse through the list of available categories to find what you
          are looking for.
        </>
      ),
      'How to see best deals?': (
        <>
          Hi {userName}, to view the best deals:
          <br />
          1. Click on the 'Best Deals' tab at the top of the page.
          <br />
          2. Browse through the list of products with the best deals and
          discounts.
        </>
      ),
      'How to see featured products?': (
        <>
          Hi {userName}, to view featured products:
          <br />
          1. Click on the 'Featured' tab at the top of the page.
          <br />
          2. Browse through the list of featured products.
        </>
      ),
      'How to see product availability?': (
        <>
          Hi {userName}, to check product availability:
          <br />
          1. Go to the product page of the item you are interested in.
          <br />
          2. The availability status will be displayed next to the product
          details.
        </>
      ),
      'How to see product details?': (
        <>
          Hi {userName}, to view product details:
          <br />
          1. Click on the product you are interested in.
          <br />
          2. You will see detailed information including description,
          specifications, reviews, and availability.
        </>
      ),
      'How to see events?': (
        <>
          Hi {userName}, to view events:
          <br />
          1. Click on the 'Events' tab at the top of the page.
          <br />
          2. Browse through the list of upcoming and ongoing events related to
          our products and services.
        </>
      ),
      'How many days before the product will be delivered?': (
        <>
          Hi {userName}, the delivery time depends on your location and the
          shipping method you choose. Generally, our delivery times are:
          <br />
          1. <strong>Standard Shipping</strong>: 5-7 business days.
          <br />
          2. <strong>Express Shipping</strong>: 2-3 business days.
          <br />
          3. <strong>International Shipping</strong>: 10-15 business days.
          <br />
          You will receive an estimated delivery date during checkout and in
          your order confirmation email.
        </>
      ),
    },
    tagalog: {
      'Paano mag-order?': (
        <>
          Kumusta {userName}, upang mag-order, sundin ang mga hakbang na ito:
          <br />
          1. Mag-browse sa aming mga kategorya at piliin ang mga produktong
          gusto mo.
          <br />
          2. I-click ang 'Add to Cart' sa pahina ng produkto.
          <br />
          3. Kapag naisama mo na lahat ng nais mong mga item sa iyong cart,
          i-click ang icon ng cart sa kanang itaas na sulok.
          <br />
          4. Suriin ang iyong cart at i-click ang 'Proceed to Checkout'.
          <br />
          5. Ilagay ang iyong mga detalye sa pagpapadala at piliin ang paraan ng
          pagbabayad.
          <br />
          6. Suriin ang iyong order at i-click ang 'Place Order'.
          <br />
          Makakatanggap ka ng isang email ng kumpirmasyon na may mga detalye ng
          order.
        </>
      ),
      'Paano mag-refund?': (
        <>
          Kumusta {userName}, upang mag-request ng refund, sundin ang mga
          hakbang na ito:
          <br />
          1. Mag-login sa iyong account.
          <br />
          2. Pumunta sa 'My Orders' sa iyong profile dashboard.
          <br />
          3. Piliin ang order na gusto mong i-refund.
          <br />
          4. I-click ang 'Request Refund' at magbigay ng dahilan para sa refund.
          <br />
          5. Susuriin ng aming support team ang iyong request at
          makikipag-ugnayan sa iyo sa loob ng 3-5 araw ng negosyo.
          <br />
          Ikaw ay aabisuhan sa pamamagitan ng email tungkol sa status ng iyong
          refund request.
        </>
      ),
      'Ano ang inyong mga polisiya?': (
        <>
          Kumusta {userName}, ang aming mga polisiya ay ang mga sumusunod:
          <br />
          1. <strong>Return Policy</strong>: Maaari mong ibalik ang mga produkto
          sa loob ng 30 araw mula sa pag-deliver. Ang mga item ay dapat nasa
          kanilang orihinal na kondisyon.
          <br />
          2. <strong>Refund Policy</strong>: Ang mga refund ay pinoproseso sa
          loob ng 7-10 araw ng negosyo pagkatapos matanggap at masuri ang mga
          ibinalik na item.
          <br />
          3. <strong>Shipping Policy</strong>: Nag-aalok kami ng standard at
          express shipping options. Ang mga singil sa pagpapadala ay kinakalkula
          batay sa iyong lokasyon at timbang ng package.
          <br />
          4. <strong>Privacy Policy</strong>: Pinahahalagahan namin ang iyong
          privacy at tinitiyak na ang iyong personal na impormasyon ay
          protektado. Para sa karagdagang detalye, bisitahin ang aming Privacy
          Policy page.
        </>
      ),
      'Live Chat': (
        <span>
          Kumusta {userName}, salamat sa iyong pag-abot sa admin. I-click lamang
          ito{' '}
          <button
            className="bg-[#78683a96] p-2 mr-2 rounded-lg cursor-pointer hover:bg-[#171203] hover:text-[#fff] whitespace-nowrap"
            onClick={handleButtonClick}
          >
            Live Chat
          </button>{' '}
          upang magpadala ng mensahe.
        </span>
      ),
      'Paano gumawa at mag-activate ng account?': (
        <>
          Kumusta {userName}, upang gumawa at mag-activate ng account:
          <br />
          1. I-click ang 'Sign Up' na button sa kanang itaas na sulok ng pahina.
          <br />
          2. Punan ang mga kinakailangang detalye tulad ng iyong pangalan,
          email, at password.
          <br />
          3. I-click ang 'Register' at makakatanggap ka ng isang activation
          email.
          <br />
          4. Buksan ang email at i-click ang activation link upang i-activate
          ang iyong account.
          <br />
          5. Maaari ka nang mag-login gamit ang iyong mga kredensyal.
        </>
      ),
      'Paano i-update ang impormasyon ng profile?': (
        <>
          Kumusta {userName}, upang i-update ang iyong impormasyon sa profile:
          <br />
          1. Mag-login sa iyong account.
          <br />
          2. Pumunta sa 'My Profile' mula sa dashboard.
          <br />
          3. I-click ang 'Edit Profile' at i-update ang mga kinakailangang
          detalye.
          <br />
          4. I-click ang 'Save' upang i-update ang iyong impormasyon.
        </>
      ),
      'Paano magpalit ng password?': (
        <>
          Kumusta {userName}, upang magpalit ng iyong password:
          <br />
          1. Mag-login sa iyong account.
          <br />
          2. Pumunta sa 'My Profile' at i-click ang 'Change Password'.
          <br />
          3. Ilagay ang iyong kasalukuyang password at ang bagong password.
          <br />
          4. I-click ang 'Save' upang i-update ang iyong password.
        </>
      ),
      'Paano makita ang lahat ng aking mga order?': (
        <>
          Kumusta {userName}, upang makita ang lahat ng iyong mga order:
          <br />
          1. Mag-login sa iyong account.
          <br />
          2. Pumunta sa 'My Orders' mula sa dashboard.
          <br />
          3. Makikita mo ang listahan ng lahat ng iyong mga order at ang
          kanilang status.
        </>
      ),
      'Paano makita ang aking mga address?': (
        <>
          Kumusta {userName}, upang makita ang iyong mga naka-save na address:
          <br />
          1. Mag-login sa iyong account.
          <br />
          2. Pumunta sa 'My Addresses' mula sa dashboard.
          <br />
          3. Makikita mo ang listahan ng lahat ng iyong mga naka-save na address
          at maaari kang magdagdag o mag-edit ng mga address dito.
        </>
      ),
      'Paano subaybayan ang status ng aking order?': (
        <>
          Kumusta {userName}, upang subaybayan ang status ng iyong order:
          <br />
          1. Mag-login sa iyong account.
          <br />
          2. Pumunta sa 'My Orders' mula sa dashboard.
          <br />
          3. I-click ang order na nais mong subaybayan.
          <br />
          4. Makikita mo ang kasalukuyang status at impormasyon ng tracking.
          <br />
          5. Makakatanggap ka rin ng email updates kapag nagbago ang status ng
          iyong order.
        </>
      ),
      'Paano magdagdag ng produkto sa wishlist?': (
        <>
          Kumusta {userName}, upang magdagdag ng produkto sa iyong wishlist:
          <br />
          1. Mag-browse sa aming mga produkto at piliin ang gusto mo.
          <br />
          2. I-click ang 'Add to Wishlist' na button sa pahina ng produkto.
          <br />
          3. Maaari mong tingnan ang iyong wishlist sa pamamagitan ng pagpunta
          sa 'My Wishlist' mula sa iyong profile dashboard.
        </>
      ),
      'Paano magdagdag ng produkto sa cart?': (
        <>
          Kumusta {userName}, upang magdagdag ng produkto sa iyong cart:
          <br />
          1. Mag-browse sa aming mga produkto at piliin ang gusto mong bilhin.
          <br />
          2. I-click ang 'Add to Cart' na button sa pahina ng produkto.
          <br />
          3. Maaari mong tingnan ang iyong cart sa pamamagitan ng pag-click sa
          icon ng cart sa kanang itaas na sulok ng pahina.
        </>
      ),
      'Paano mag-checkout?': (
        <>
          Kumusta {userName}, upang mag-checkout:
          <br />
          1. I-click ang icon ng cart sa kanang itaas na sulok ng pahina.
          <br />
          2. Suriin ang mga item sa iyong cart at i-click ang 'Proceed to
          Checkout'.
          <br />
          3. Ilagay ang iyong mga detalye sa pagpapadala at piliin ang paraan ng
          pagbabayad.
          <br />
          4. Suriin ang iyong order at i-click ang 'Place Order'.
          <br />
          5. Makakatanggap ka ng isang email ng kumpirmasyon na may mga detalye
          ng iyong order at resibo.
        </>
      ),
      'Paano gumawa ng sarili kong disenyo?': (
        <>
          Kumusta {userName}, upang gumawa ng sarili mong disenyo:
          <br />
          1. Piliin ang isang produkto na nag-aalok ng customization, tulad ng
          aming mga engraving items.
          <br />
          2. I-click ang 'Customize' na button sa pahina ng produkto.
          <br />
          3. Gamitin ang aming design tool upang magdagdag ng iyong teksto o
          disenyo.
          <br />
          4. I-preview ang iyong disenyo at i-click ang 'Add to Cart' kapag ikaw
          ay nasiyahan.
          <br />
          5. Magpatuloy sa checkout gaya ng dati.
        </>
      ),
      'Paano maghanap ng produkto?': (
        <>
          Kumusta {userName}, upang maghanap ng produkto:
          <br />
          1. Gamitin ang search bar sa itaas ng pahina.
          <br />
          2. Ilagay ang pangalan ng produkto o keywords at pindutin ang 'Enter'.
          <br />
          3. Mag-browse sa mga resulta ng paghahanap upang mahanap ang iyong
          nais na produkto.
        </>
      ),
      'Paano makita ang lahat ng kategorya ng produkto?': (
        <>
          Kumusta {userName}, upang makita ang lahat ng kategorya ng produkto:
          <br />
          1. I-click ang 'Categories' tab sa itaas ng pahina.
          <br />
          2. Mag-browse sa listahan ng mga available na kategorya upang mahanap
          ang iyong hinahanap.
        </>
      ),
      'Paano makita ang pinakamahusay na mga deal?': (
        <>
          Kumusta {userName}, upang makita ang pinakamahusay na mga deal:
          <br />
          1. I-click ang 'Best Deals' tab sa itaas ng pahina.
          <br />
          2. Mag-browse sa listahan ng mga produkto na may pinakamahusay na deal
          at diskwento.
        </>
      ),
      'Paano makita ang mga itinatampok na produkto?': (
        <>
          Kumusta {userName}, upang makita ang mga itinatampok na produkto:
          <br />
          1. I-click ang 'Featured' tab sa itaas ng pahina.
          <br />
          2. Mag-browse sa listahan ng mga itinatampok na produkto.
        </>
      ),
      'Paano makita ang availability ng produkto?': (
        <>
          Kumusta {userName}, upang suriin ang availability ng produkto:
          <br />
          1. Pumunta sa pahina ng produkto ng item na interesado ka.
          <br />
          2. Ang status ng availability ay ipapakita sa tabi ng mga detalye ng
          produkto.
        </>
      ),
      'Paano makita ang mga detalye ng produkto?': (
        <>
          Kumusta {userName}, upang makita ang mga detalye ng produkto:
          <br />
          1. I-click ang produkto na interesado ka.
          <br />
          2. Makikita mo ang detalyadong impormasyon kasama ang deskripsyon, mga
          espesipikasyon, mga review, at availability.
        </>
      ),
      'Paano makita ang mga event?': (
        <>
          Kumusta {userName}, upang makita ang mga event:
          <br />
          1. I-click ang 'Events' tab sa itaas ng pahina.
          <br />
          2. Mag-browse sa listahan ng mga paparating at kasalukuyang event na
          may kaugnayan sa aming mga produkto at serbisyo.
        </>
      ),
      'Ilang araw bago ma-deliver ang produkto?': (
        <>
          Kumusta {userName}, ang oras ng pag-deliver ay depende sa iyong
          lokasyon at ang paraan ng pagpapadala na pinili mo. Sa pangkalahatan,
          ang aming oras ng pag-deliver ay:
          <br />
          1. <strong>Standard Shipping</strong>: 5-7 araw ng negosyo.
          <br />
          2. <strong>Express Shipping</strong>: 2-3 araw ng negosyo.
          <br />
          3. <strong>International Shipping</strong>: 10-15 araw ng negosyo.
          <br />
          Makakatanggap ka ng tinantyang petsa ng pag-deliver sa panahon ng
          pag-checkout at sa iyong email ng kumpirmasyon ng order.
        </>
      ),
    },
  };

  const keywordMapping = {
    'How to order?': [
      'How to order?',
      'order',
      'how to buy',
      'purchasing',
      'placing an order',
      'purchase',
      'buy',
    ],
    'How to refund?': ['How to refund?', 'refund', 'return', 'money back'],
    'What are your policies?': [
      'What are your policies?',
      'policies',
      'rules',
      'terms',
      'conditions',
    ],
    'Live chat': ['Live chat', 'chat', 'talk to support', 'customer service'],
    'How to create and activate an account?': [
      'How to create and activate an account?',
      'create account',
      'sign up',
      'register',
      'activate account',
      'activation',
      'create user',
    ],
    'How to update profile information?': [
      'How to update profile information?',
      'update profile',
      'change details',
      'edit profile',
      'profile',
    ],
    'How to change the password?': [
      'How to change the password?',
      'change password',
      'reset password',
      'update password',
    ],
    'How to see all my orders?': [
      'How to see all my orders?',
      'my orders',
      'order history',
      'view orders',
    ],
    'How to see my addresses?': [
      'How to see my addresses?',
      'my addresses',
      'saved addresses',
      'delivery addresses',
      'update address',
    ],
    'How to track my order status?': [
      'How to track my order status?',
      'track order',
      'order status',
      'tracking information',
    ],
    'How to add a product to wishlist?': [
      'How to add a product to wishlist?',
      'add to wishlist',
      'save for later',
    ],
    'How to add a product to cart?': [
      'How to add a product to cart?',
      'add to cart',
      'shopping cart',
      'buy now',
    ],
    'How to check out?': [
      'How to check out?',
      'checkout',
      'place order',
      'buy now',
    ],
    'How to create my own design?': [
      'How to create my own design?',
      'create design',
      'customize product',
      'personalization',
    ],
    'How to search for a product?': [
      'How to search for a product?',
      'search product',
      'find item',
      'look for product',
    ],
    'How to see all product categories?': [
      'How to see all product categories?',
      'product categories',
      'browse categories',
      'all categories',
    ],
    'How to see best deals?': [
      'How to see best deals?',
      'best deals',
      'discounts',
      'offers',
      'promotions',
    ],
    'How to see featured products?': [
      'How to see featured products?',
      'featured products',
      'top picks',
      'recommended items',
    ],
    'How to see product availability?': [
      'How to see product availability?',
      'product availability',
      'in stock',
      'available now',
    ],
    'How to see product details?': [
      'How to see product details?',
      'product details',
      'item specifics',
      'product info',
    ],
    'How to see events?': [
      'How to see events?',
      'events',
      'promotions',
      'sales events',
    ],
    'How many days before the product will be delivered?': [
      'How many days before the product will be delivered?',
      'delivery days',
      'shipping time',
      'delivery schedule',
    ],
    'Paano mag-order?': ['Paano mag-order?', 'order', 'bumili', 'pagbili'],
    'Paano mag-refund?': [
      'Paano mag-refund?',
      'refund',
      'ibalik ang pera',
      'return',
    ],
    'Ano ang inyong mga polisiya?': [
      'Ano ang inyong mga polisiya?',
      'polisiya',
      'patakaran',
      'terms',
      'conditions',
    ],
    'Live Chat': [
      'Live Chat',
      'chat',
      'kausapin ang support',
      'customer service',
    ],
    'Paano gumawa at mag-activate ng account?': [
      'Paano gumawa at mag-activate ng account?',
      'gumawa ng account',
      'mag-sign up',
      'magrehistro',
      'activate account',
    ],
    'Paano i-update ang impormasyon ng profile?': [
      'Paano i-update ang impormasyon ng profile?',
      'update profile',
      'baguhin ang detalye',
      'edit profile',
    ],
    'Paano magpalit ng password?': [
      'Paano magpalit ng password?',
      'magpalit password',
      'reset password',
      'update password',
    ],
    'Paano makita ang lahat ng aking mga order?': [
      'Paano makita ang lahat ng aking mga order?',
      'aking mga order',
      'history ng order',
      'tingnan ang mga order',
    ],
    'Paano makita ang aking mga address?': [
      'Paano makita ang aking mga address?',
      'aking address',
      'mga address',
      'delivery address',
    ],
    'Paano subaybayan ang status ng aking order?': [
      'Paano subaybayan ang status ng aking order?',
      'subaybayan ang order',
      'status ng order',
      'tracking information',
    ],
    'Paano magdagdag ng produkto sa wishlist?': [
      'Paano magdagdag ng produkto sa wishlist?',
      'wishlist',
      'save for later',
    ],
    'Paano magdagdag ng produkto sa cart?': [
      'Paano magdagdag ng produkto sa cart?',
      'cart',
      'shopping cart',
      'bumili ngayon',
    ],
    'Paano mag-checkout?': [
      'Paano mag-checkout?',
      'checkout',
      'place order',
      'bumili ngayon',
    ],
    'Paano gumawa ng sarili kong disenyo?': [
      'Paano gumawa ng sarili kong disenyo?',
      'sariling disenyo',
      'i-customize ang produkto',
      'personalization',
    ],
    'Paano maghanap ng produkto?': [
      'Paano maghanap ng produkto?',
      'maghanap produkto',
      'humanap ng item',
      'tingnan ang produkto',
    ],
    'Paano makita ang lahat ng kategorya ng produkto?': [
      'Paano makita ang lahat ng kategorya ng produkto?',
      'kategorya',
      'mga kategorya ng produkto',
      'lahat ng kategorya',
    ],
    'Paano makita ang pinakamahusay na mga deal?': [
      'Paano makita ang pinakamahusay na mga deal?',
      'deal',
      'pinakamahusay na deal',
      'mga diskwento',
      'offers',
      'promotions',
    ],
    'Paano makita ang mga itinatampok na produkto?': [
      'Paano makita ang mga itinatampok na produkto?',
      'itinatampok produkto',
      'top picks',
      'recommended items',
    ],
    'Paano makita ang availability ng produkto?': [
      'Paano makita ang availability ng produkto?',
      'availability produkto',
      'in stock',
      'available ngayon',
    ],
    'Paano makita ang mga detalye ng produkto?': [
      'Paano makita ang mga detalye ng produkto?',
      'detalye produkto',
      'item specifics',
      'impormasyon ng produkto',
    ],
    'Paano makita ang mga event?': [
      'Paano makita ang mga event?',
      'event',
      'promotions',
      'sales events',
    ],
    'Ilang araw bago ma-deliver ang produkto?': [
      'Ilang araw bago ma-deliver ang produkto?',
      'ma-deliver produkto',
      'shipping time',
      'delivery schedule',
    ],
  };

  const handleSendMessage = (question) => {
    const userMessage = question || input.trim();
    let botResponse;

    Object.keys(keywordMapping).forEach((key) => {
      keywordMapping[key].forEach((keyword) => {
        if (userMessage.toLowerCase().includes(keyword.toLowerCase())) {
          botResponse = faqResponses[language][key];
        }
      });
    });

    if (botResponse) {
      setUnknownMessageCount(0);
      setMessages([
        ...messages,
        { sender: 'user', text: userMessage },
        { sender: 'bot', text: botResponse },
      ]);
    } else {
      setUnknownMessageCount((count) => count + 1);
      let response;
      if (unknownMessageCount === 0) {
        response =
          language === 'english'
            ? `Hi ${userName}, sorry, I do not understand your question.`
            : `Kumusta ${userName}, paumanhin, hindi ko maintindihan ang iyong tanong.`;
      } else {
        response = (
          <span>
            {language === 'english'
              ? `Hi ${userName}, we can direct you to the admin, so that it will address your concern, just click the`
              : `Kumusta ${userName}, maaari ka naming idirekta sa admin, upang ma-address nito ang iyong concern, i-click lamang ang`}
            <button
              className="bg-[#78683a96] p-2 mr-2 rounded-lg cursor-pointer hover:bg-[#171203] hover:text-[#fff] whitespace-nowrap"
              onClick={handleButtonClick}
            >
              {language === 'english' ? 'Live Chat' : 'Live Chat'}
            </button>
            .
          </span>
        );
      }

      setMessages([
        ...messages,
        { sender: 'user', text: userMessage },
        { sender: 'bot', text: response },
      ]);
    }
    setInput('');
  };

  const addGreetingMessage = () => {
    if (!greetingAdded) {
      const greetingMessage = isAuthenticated
        ? language === 'english'
          ? `Hello ${userName}, what can I help you with today?`
          : `Kumusta ${userName}, ano ang maitutulong ko sa iyo ngayon?`
        : language === 'english'
        ? `Hello! What can I help you with today?`
        : `Kumusta! Ano ang maitutulong ko sa iyo ngayon?`;

      setMessages([...messages, { sender: 'bot', text: greetingMessage }]);
      setGreetingAdded(true);
    }
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
  };

  return (
    <div
      className={isOpen ? styles.chatboxOpen : styles.chatboxClosed}
      onClick={() => {
        setIsOpen(!isOpen);
        if (!isOpen) {
          addGreetingMessage();
        }
      }}
    >
      <div className={styles.chatboxHeader}>
        {isOpen ? (
          <div className="flex items-center justify-between">
            <RiRobot2Line size={30} />
            <h1 className="font-Roboto font-600 flex items-center justify-center mr-2">
              {language === 'english' ? "Hi! I'm Engrabot" : 'Ako si Engrabot'}
            </h1>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="p-1 border rounded bg-white text-black"
            >
              <option value="english">English</option>
              <option value="tagalog">Tagalog</option>
            </select>
            <RxCross1
              size={20}
              className="flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />
          </div>
        ) : (
          <RiRobot2Line size={30} />
        )}
      </div>
      {isOpen && (
        <div
          className={`${styles.chatboxContent} overflow-y-scroll hide-scrollbar`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${styles.chatboxMessages} hide-scrollbar`}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.sender === 'user'
                    ? styles.userMessage
                    : styles.botMessage
                }
              >
                {message.sender === 'bot' && (
                  <div className="">
                    <div className="flex items-center justify-start">
                      <RiRobot2Line size={30} />
                      <h1 className="font-Roboto ml-2 font-600 flex items-center justify-center ">
                        Engrabot
                      </h1>
                    </div>
                    <hr className="w-full mb-1 mt-1" />
                  </div>
                )}
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex items-center">
            <button className={styles.scrollButton} onClick={scrollLeft}>
              &#8592;
            </button>
            <div
              className={`${styles.chatboxSelection} flex overflow-x-auto hide-scrollbar`}
              ref={scrollContainerRef}
            >
              {Object.keys(faqResponses[language]).map((question, index) => (
                <button
                  key={index}
                  className={styles.chatboxSelectionButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSendMessage(question);
                  }}
                >
                  {question}
                </button>
              ))}
            </div>
            <button className={styles.scrollButton} onClick={scrollRight}>
              &#8594;
            </button>
          </div>
          <div className={styles.chatboxInput}>
            <input
              className={styles.chatboxInputField}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'english'
                  ? 'Type your question...'
                  : 'I-type ang iyong tanong...'
              }
              onClick={(e) => e.stopPropagation()} // Prevent input click from closing the chatbox
            />
            <button
              className={styles.chatboxInputButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent button click from closing the chatbox
                handleSendMessage();
              }}
            >
              {language === 'english' ? 'Send' : 'Ipadala'}
            </button>
          </div>
        </div>
      )}
      {!isOpen && showCloudMessage && (
        <div className={styles.cloudMessage}>
          <h1 className="font-Roboto font-600">
            {language === 'english'
              ? 'Do you have inquiries?'
              : 'May mga tanong ka ba?'}
          </h1>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
