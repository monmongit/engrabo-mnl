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
  modalImage: 'w-[450px] max-h-[70vh] pt-3',

  // Additional responsive styles
  '@media (min-width: 800px)': {
    modal:
      'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50 max-w-[80%] max-h-screen w-[60%] h-[70%]',
    chatboxClosed:
      'fixed bottom-20 right-10 w-16 h-16 bg-[#171203] text-white rounded-full flex items-center justify-center cursor-pointer',
  },

  // Chatbox styles
  chatboxClosed:
    'fixed bottom-20 right-5 w-20 h-20 bg-[#171203] text-white rounded-full flex items-center justify-center cursor-pointer',
  chatboxOpen:
    'fixed bottom-20 right-5 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-lg flex flex-col',
  chatboxHeader: 'bg-[#171203] text-white p-3 text-center cursor-pointer',
  chatboxContent: 'flex flex-col flex-1',
  chatboxMessages: 'flex-1 p-3 overflow-y-auto flex flex-col',

  userMessage:
    'text-right p-2 m-2 bg-[#171203] text-white rounded-lg self-end max-w-[80%]',
  botMessage:
    'text-left p-2 m-2 bg-[#78683a96] text-white rounded-lg self-start max-w-[80%]',
  chatboxInput: 'flex p-2',
  chatboxInputField: 'flex-1 p-2 border border-gray-300 rounded-lg',
  chatboxInputButton:
    'p-2 bg-[#171203] text-white rounded-lg ml-2 cursor-pointer',
  chatboxSelection: 'flex flex-wrap p-3 gap-2 overflow-y-auto',
  chatboxSelectionButton:
    'bg-gray-200 p-2 rounded-lg cursor-pointer hover:bg-gray-300',
  cloudMessage:
    'fixed bottom-30 right-20 text-[#171203]  bg-white border border-[#171203] rounded-lg shadow-lg p-3 z-50',
};

export default styles;
