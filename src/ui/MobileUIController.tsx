import { useShotEffects } from "../hooks/useShotEffects";
import PowerMeterRevised from "./PowerMeterRevised";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useExperience } from "../hooks/useExperience";

export default function MobileUIController() {
  const shotEffects = useShotEffects() || {
    holesHit: 0,
    holesRemaining: 6,
    streak: 0,
    uiMessage: "",
    setUiMessage: () => {},
  };
  const { holesHit, holesRemaining, streak, uiMessage } = shotEffects;
  const { playSFX } = useExperience();
  const [showMsg, setShowMsg] = useState(false);

  //   const remaining = holes.length - holesHit

  const handleShow = () => {
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 1000);
    playSFX("new_turn");
  };

  return (
    <div className="fixed inset-0 z-50 grid grid-cols-10 grid-rows-20  ">
      {/* <div className="rounded-xl text-center text-gray-800 flex flex-col items-start pl-4 pt-2 pointer-events-auto col-span-3 row-span-2">
        <div className="text-3xl font-bold">{holesRemaining}/6</div>
        <span className="text-sm font-medium">Remaining</span>
      </div> */}
      <div
        className="absolute top-2 left-2 h-14 flex items-center overflow-hidden"
        style={{ minWidth: 140 }}
      >
        {/* Icon Section */}
        <div className="bg-[#2176ff] px-2 py-2 flex items-center h-full">
          <img
            src="/golfpong/golfball7.png"
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
        </div>
        {/* Info Section */}
        <div className="flex flex-col h-full">
          <div className="bg-[#2176ff] flex items-center px-3 flex-1">
            <span className="text-white font-semibold text-base">User</span>
          </div>
          <div className="bg-white flex items-center px-3 flex-1">
            <span className="text-gray-700 text-base font-semibold">
              Stroke {holesHit + 1}
            </span>
          </div>
        </div>
        {/* Points Section */}
        <div className="bg-[#2c2d41] px-4 py-1 flex flex-col items-center justify-center h-full">
          <span className="text-white text-lg font-bold">{holesRemaining}</span>
          <span className="text-[#ff9800] text-xs font-bold -mt-1">pt</span>
        </div>
      </div>

      <div className=" items-end justify-items-end rounded-lg  font-semibold text-base text-gray-700 pointer-events-auto col-start-9 col-end-11 row-span-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[80%] h-auto"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.7 14C10.623 14 9.74999 13.1046 9.74999 12C9.74999 10.8954 10.623 10 11.7 10C12.7769 10 13.65 10.8954 13.65 12C13.65 12.5304 13.4445 13.0391 13.0789 13.4142C12.7132 13.7893 12.2172 14 11.7 14Z"
              stroke="#000000"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.8841 16.063V14.721C16.8841 14.3887 17.0128 14.07 17.2419 13.835L18.1672 12.886C18.6443 12.3967 18.6443 11.6033 18.1672 11.114L17.2419 10.165C17.0128 9.93001 16.8841 9.61131 16.8841 9.27899V7.93599C16.8841 7.24398 16.3371 6.68299 15.6624 6.68299H14.353C14.029 6.68299 13.7182 6.55097 13.4891 6.31599L12.5638 5.36699C12.0867 4.87767 11.3132 4.87767 10.8361 5.36699L9.91087 6.31599C9.68176 6.55097 9.37102 6.68299 9.04702 6.68299H7.73759C7.41341 6.68299 7.10253 6.81514 6.87339 7.05034C6.64425 7.28554 6.51566 7.6045 6.51592 7.93699V9.27899C6.51591 9.61131 6.3872 9.93001 6.15809 10.165L5.23282 11.114C4.75573 11.6033 4.75573 12.3967 5.23282 12.886L6.15809 13.835C6.3872 14.07 6.51591 14.3887 6.51592 14.721V16.063C6.51592 16.755 7.06288 17.316 7.73759 17.316H9.04702C9.37102 17.316 9.68176 17.448 9.91087 17.683L10.8361 18.632C11.3132 19.1213 12.0867 19.1213 12.5638 18.632L13.4891 17.683C13.7182 17.448 14.029 17.316 14.353 17.316H15.6614C15.9856 17.3163 16.2966 17.1844 16.5259 16.9493C16.7552 16.7143 16.8841 16.3955 16.8841 16.063Z"
              stroke="#000000"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </g>
        </svg>
      </div>

      <AnimatePresence>
        {showMsg && (
          <motion.div
            key={uiMessage}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            className="row-start-3 row-end-5 col-span-11 text-[#ffdf00] flex justify-center items-center text-5xl font-bold"
          >
            {uiMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <div className=" col-start-1 col-end-11 row-start-10 row-end-21 flex justify-center relative">
        <PowerMeterRevised onShot={() => setTimeout(handleShow, 1500)} />
      </div>
    </div>
  );
}
