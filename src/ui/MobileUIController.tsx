import { useShotEffects } from "../hooks/useShotEffects";
import PowerMeterRevised from "./PowerMeterRevised";

export default function MobileUIController() {
  const { holesHit, streak, uiMessage } = useShotEffects();

  return (
    <div className="fixed inset-0 z-50 grid grid-cols-10 grid-rows-20 ">
      <div className="bg-blue-500 rounded-xl text-center font-bold text-lg text-gray-800 pointer-events-auto col-span-3 row-span-2">
        {uiMessage}
      </div>
      {/* <div className="bg-white rounded-lg shadow px-4 py-2 font-semibold text-base text-gray-700 pointer-events-auto col-span-1">
        🏌️‍♂️ Holes Hit: {holesHit}
      </div> */}
      <div className="bg-yellow-500 items-end justify-items-end rounded-lg shadow font-semibold text-base text-gray-700 pointer-events-auto col-start-5 col-end-6">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
      
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.7 14C10.623 14 9.74999 13.1046 9.74999 12C9.74999 10.8954 10.623 10 11.7 10C12.7769 10 13.65 10.8954 13.65 12C13.65 12.5304 13.4445 13.0391 13.0789 13.4142C12.7132 13.7893 12.2172 14 11.7 14Z"
              stroke="#000000"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M16.8841 16.063V14.721C16.8841 14.3887 17.0128 14.07 17.2419 13.835L18.1672 12.886C18.6443 12.3967 18.6443 11.6033 18.1672 11.114L17.2419 10.165C17.0128 9.93001 16.8841 9.61131 16.8841 9.27899V7.93599C16.8841 7.24398 16.3371 6.68299 15.6624 6.68299H14.353C14.029 6.68299 13.7182 6.55097 13.4891 6.31599L12.5638 5.36699C12.0867 4.87767 11.3132 4.87767 10.8361 5.36699L9.91087 6.31599C9.68176 6.55097 9.37102 6.68299 9.04702 6.68299H7.73759C7.41341 6.68299 7.10253 6.81514 6.87339 7.05034C6.64425 7.28554 6.51566 7.6045 6.51592 7.93699V9.27899C6.51591 9.61131 6.3872 9.93001 6.15809 10.165L5.23282 11.114C4.75573 11.6033 4.75573 12.3967 5.23282 12.886L6.15809 13.835C6.3872 14.07 6.51591 14.3887 6.51592 14.721V16.063C6.51592 16.755 7.06288 17.316 7.73759 17.316H9.04702C9.37102 17.316 9.68176 17.448 9.91087 17.683L10.8361 18.632C11.3132 19.1213 12.0867 19.1213 12.5638 18.632L13.4891 17.683C13.7182 17.448 14.029 17.316 14.353 17.316H15.6614C15.9856 17.3163 16.2966 17.1844 16.5259 16.9493C16.7552 16.7143 16.8841 16.3955 16.8841 16.063Z"
              stroke="#000000"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </div>
      <div className="bg-red-500 col-start-1 col-end-11 row-start-10 row-end-21 flex justify-center relative">
        <PowerMeterRevised />
      </div>
    </div>
  );
}
