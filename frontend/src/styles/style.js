const styles = {
  custom_container: 'w-11/12 hidden sm:block',
  heading:
    'text-[27px] text-center md:text-start font-[600] font-Roboto pb-[20px]',
  section: 'w-11/12 mx-auto',
  productTitle: 'text-[25px] font-[600] font-Roboto text-[#171203]',
  productDiscountPrice: 'font-bold text-[18px] text-[#171203] font-Roboto',
  price: 'font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-4px] line-through',
  shop_name: 'pt-3 text-[15px] text-[#171203] pb-3',
  active_indicator: 'absolute bottom-[-27%] left-0 h-[3px] w-full bg-[#534723]',
  button:
    'w-[150px] bg-[#171203] h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer hover:opacity-95 transition duration-300 ease-in-out',
  cart_button:
    'px-[20px] h-[38px] rounded-[20px] bg-[#171203] flex items-center justify-center cursor-pointer',
  cart_button_text: 'text-[#fff] text-[16px] font-[600]',
  input: 'w-full border p-1 rounded-[5px]',
  activeStatus:
    'w-[10px] h-[10px] rounded-full absolute top-0 right-1 bg-[#40d132]',
  normalFlex: 'flex items-center',

  // Modal styles
  modal:
    'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50 max-w-[500px] max-h-screen w-[80%] h-auto',
  overlay: 'fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 z-40',
  closeButton: 'absolute top-2 right-2 text-gray-600 cursor-pointer ',
  modalImage: 'max-w-full max-h-[70vh] pt-3',

  // Additional responsive styles
  '@media (min-width: 800px)': {
    modal:
      'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50 max-w-[80%] max-h-screen w-[60%] h-[70%]',
  },
};

export default styles;
