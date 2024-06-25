import React, { useRef, useState } from "react";
import { BiPause, BiPlay } from "react-icons/bi";
import { CiMenuKebab } from "react-icons/ci";

export default function SongRow({ songData }) {

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>();

  return (
    <tr key={songData.id} className="bg-gray-800 border-gray-700 hover:bg-gray-600">
      <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
        {songData.data?.song_id || "N/A"}
      </th>
      <td className="px-6 py-4">
        {songData.data.title || "N/A"}
      </td>
      {/* <td className="px-6 py-4">
        <p className="cursor-pointer">{songData.data.audio_url.slice(0, 7)}...{songData.data.audio_url.slice(-8)}</p>
      </td> */}
      <td className="px-6 py-4 flex justify-end gap-x-2">
        <button onClick={() => {
          if (isPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play()
          }
          setIsPlaying(!isPlaying)
        }}>
          {isPlaying ? <BiPause size={32} /> : <BiPlay size={32} />}
        </button>
        <button className="font-medium">
          <CiMenuKebab size={20} />
        </button>


        <audio src={songData?.data?.audio_url} ref={audioRef} className="hidden"></audio>
      </td>
    </tr>
  )
}