import { useEffect, useState } from "react";
import background from "../assets/img/background.png";
import { RandomReveal } from "react-random-reveal";
import Confetti from "react-confetti";
import { getDataUndian } from "../api/collection";
import axios from "axios";
import _ from "lodash";

type Props = {};

export default function UndianPage({}: Props) {
  const containerStyle = {
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100vw",
    height: "100vh",
  };

  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [showConfetti, setShowConfetti] = useState(false);

  const [startRandom, setStartRandom] = useState(false);

  const [winnerData, setWinnerData] = useState();

  const [duration, setDuration] = useState(9999);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [dataParticipant, setDataParticipant] = useState({
    data: [],
    length: 0,
  });

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setIsLoading(true);
    let data = await getDataUndian();

    data = {
      data: data.transactions,
      length: data.numberOfTransaction,
    };

    if (!_.isEmpty(data.data)) {
      setDataParticipant(data);
    }
    setIsLoading(false);
  }

  async function handleComplete() {
    setShowConfetti(true);
    const query = {
      query: `mutation {
        updateTransaction(updateTransactionInput: {
            id: "${winnerData?.id}",
            isWinner: true,
        }, updateUserInput: {
            id: "${winnerData?.user?.id}",
            status: ACTIVE
        }) {
            id
            user {
                id
                userName
                displayName
                type
                status
                createdAt
                updatedAt
            }
            mobile
            isWinner
            uniqueCode
            branch
            createdAt
            updatedAt
        }
    }`,
    };
    await axios.post(`${import.meta.env.VITE_BASE_URL_API}/graphql`, query, {
      headers: {
        "Content-Type": "application/json",
        Authorization: import.meta.env.VITE_AUTH_TOKEN,
      },
    });
    getData();
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
        />
      )}
      <div className="relative">
        <div style={containerStyle}></div>
        <div className="fixed inset-0 flex items-center justify-start">
          <div
            className={`text-black ${
              startRandom && "border-8 border-black p-8"
            } rounded font-bold text-9xl mb-6 mx-10 tracking-wide text-center`}
          >
            {/* <div
              className={`tracking-normal transition-all duration-1000 mb-4 ${
                showConfetti ? "opacity-100" : "opacity-0"
              }`}
            >
              {winnerData?.user?.displayName}
            </div> */}
            {startRandom && (
              <RandomReveal
                isPlaying={startRandom}
                duration={duration}
                updateInterval={0.1}
                revealDuration={0.5}
                characterSet={winnerData?.user?.displayName.split("")}
                characters={winnerData?.user?.displayName.split("")}
                onComplete={() => handleComplete()}
              />
            )}
          </div>
        </div>
        <div className="mb-24 absolute w-full inset-x-0 bottom-0 space-y-3">
          <div className="flex justify-center space-x-3">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-black py-2 px-4 rounded disabled:bg-slate-400"
              onClick={async () => {
                setDuration(99);
                setWinnerData(
                  dataParticipant?.data[
                    Math.floor(Math.random() * dataParticipant?.data.length)
                  ]
                );
                setStartRandom(true);
              }}
              disabled={_.isEmpty(dataParticipant?.data)}
            >
              {isLoading
                ? "Memuat Data..."
                : _.isEmpty(dataParticipant?.data)
                ? dataParticipant?.length === 0 &&
                  "Tidak Memenuhi Minimal Partisipan"
                : "Start"}
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-black py-2 px-4 rounded disabled:bg-slate-400"
              onClick={async () => {
                setDuration(0);
                handleComplete();
              }}
              // disabled={_.isEmpty(dataParticipant?.data)}
            >
              Stop
            </button>
          </div>

          <div className="flex justify-center">
            <button
              className=" bg-blue-400 hover:bg-blue-500 text-black py-2 px-4 rounded disabled:bg-slate-400"
              onClick={async () => {
                setStartRandom(false);
                setShowConfetti(false);
                setWinnerData(
                  dataParticipant?.data[
                    Math.floor(Math.random() * dataParticipant?.data.length)
                  ]
                );
              }}
              disabled={isLoading}
            >
              Mulai Lagi
            </button>
          </div>
        </div>

        {/* <div className="fixed inset-x-0 bottom-3 text-black text-center">
          © 2024 BKN
        </div> */}
      </div>
    </>
  );
}
