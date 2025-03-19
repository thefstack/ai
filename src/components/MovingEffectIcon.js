import { ChevronLeft, ChevronRight } from "lucide-react";


const MovingIcon = ({onTouch, showList}) => {

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius:"10px",
        justifyContent: "center",
        cursor: "pointer",
        position: "relative",
        width: "40px",
        height: "40px",
        animation: showList
            ? "moveLeft 10s ease-in-out infinite"
            : "moveRight 10s ease-in-out infinite",
      }}
      onClick={onTouch}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          
        }}
      >
        {showList ? <ChevronLeft size={45} style={{borderRadius:"10px", padding:"5px", background:"rgb(216 215 215 / 39%)",}} /> : <ChevronRight size={45} style={{borderRadius:"10px", padding:"5px" ,background:"rgb(216 215 215 / 39%)",}}  />}
      </div>

      <style jsx>{`
        @keyframes moveLeft {
          0% {
            transform: translateX(0px);
          }
          5% {
            transform: translateX(-10px);
          }
          10%{
            transform: translateX(0px);
          }
        }

        @keyframes moveRight {
          0% {
            transform: translateX(0px);
          }
          5% {
            transform: translateX(10px);
          }
          10%{
            transform: translateX(0px);
          }
        }
      `}</style>
    </div>
  );
};

export default MovingIcon;
