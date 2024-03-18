import React, { useEffect, useState } from "react";
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
      query: `mutation($id: String!) {
        updateTransaction(updateTransactionInput: {
            id: $id,
            isWinner: true,
        }, updateUserInput: {
            id: "34222c43-0b21-4a4d-82eb-1b50bc2255e9",
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
      variables: { id: winnerData?.id },
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
        <div className="fixed inset-x-0 bottom-20 text-center space-y-6">
          <div className="text-white font-bold text-9xl mb-56 tracking-wide">
            <div
              className={`tracking-normal transition-all duration-1000 mb-4 ${
                showConfetti ? "opacity-100" : "opacity-0"
              }`}
            >
              {winnerData?.user?.displayName}
            </div>
            {startRandom && (
              <RandomReveal
                isPlaying={startRandom}
                duration={duration}
                revealDuration={1.6}
                characters={winnerData?.uniqueCode}
                onComplete={() => handleComplete()}
              />
            )}
          </div>
          <div className="flex justify-center space-x-3">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:bg-slate-400"
              onClick={async () => {
                setDuration(99);
                setWinnerData(
                  dataParticipant?.data[Math.floor(Math.random() * 1)]
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
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded disabled:bg-slate-400"
              onClick={async () => {
                setDuration(0);
                handleComplete();
              }}
              // disabled={_.isEmpty(dataParticipant?.data)}
            >
              Stop
            </button>
          </div>
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded disabled:bg-slate-400"
            onClick={async () => {
              setStartRandom(false);
              setShowConfetti(false);
              setWinnerData(
                dataParticipant?.data[Math.floor(Math.random() * 1)]
              );
            }}
            disabled={isLoading}
          >
            Mulai Lagi
          </button>
        </div>
        {/* <div className="fixed inset-x-0 bottom-3 text-white text-center">
          © 2024 BKN
        </div> */}
      </div>
    </>
  );
}
