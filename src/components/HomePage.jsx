import { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";

const HomePage = (props) => {

  const {setAudioStream, setFile} = props
  const [recordingStatus, setRecordingState] = useState('inactive')
  const[audioChunks, setAudioChunks] = useState([])
  const[duration, setDuration] = useState(0)
  const mediaRecorder = useRef(null)
  const mimeType = 'audio/webm'

  async function startRecording(){
    let tempStream 
    console.log('Start recording')
    try{
      const streamData = navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
    }catch(err){
      console.log(err.message)
      return
    }

    const media = new MediaRecorder(tempStream, {type: mimeType})
    mediaRecorder.current = media

    mediaRecorder.current.start()
    let localAudioChunks = []
    mediaRecorder.current.ondataavailable = (event) =>{
      if(typeof event.data === 'undefined'){return}
      if(typeof event.data === 0){return}
      localAudioChunks.push(event.data)
    }

    setAudioChunks(localAudioChunks)
  }




  const [isRecording, setIsRecording] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setDots((prev) => (prev === "..." ? "" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setDots("");
    }
  }, [isRecording]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="p-4 flex flex-col gap-6 sm:gap-8 md:gap-10 text-center pb-20">
        <motion.h1
          className="font-semibold text-5xl sm:text-6xl md:text-7xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Voice<span className="text-blue-400 font-bold">Transcribe</span>
        </motion.h1>

        <motion.h3
          className="font-medium md:text-lg sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          Record <span className="text-blue-400">→</span> Transcribe
          <span className="text-blue-400"> →</span> Translate
        </motion.h3>

        <motion.button
          className={`relative flex items-center justify-center text-lg gap-4 mx-auto w-72 max-w-full border-2 px-6 py-3 rounded-full overflow-hidden transition-all ${
            isRecording
              ? "border-red-500 text-red-500"
              : "border-blue-400 text-blue-400"
          }`}
          style={{
            boxShadow: isRecording
              ? "0px 14px 55px rgba(255, 96, 96, 0.35)"
              : "0px 14px 55px rgba(96, 165, 255, 0.35)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRecording(!isRecording)}
        >
          <span> {isRecording ? "Recording" : "Record"} </span>

          <span className="w-6 text-left">{dots}</span>

          <motion.div
            animate={isRecording ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaMicrophone
              className={`text-2xl ${
                isRecording ? "text-red-500" : "text-gray-700"
              }`}
            />
          </motion.div>
        </motion.button>

        <motion.p
          className="text-black cursor-pointer hover:text-blue-400 transition duration-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          whileHover={{
            textShadow: "0px 0px 5px rgba(0, 150, 255, 0.6)",
            color: "rgba(0, 150, 255, 1)",
          }}
        >
          Or{" "}
          <label className="cursor-pointer text-blue-500">
            upload <input className="hidden" type="file" accept=".mp3,.wav" />
          </label>
          an MP3 file
        </motion.p>
      </main>
    </div>
  );
};

export default HomePage;
