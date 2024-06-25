"use client";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { CiMenuKebab } from "react-icons/ci";

export default function Songs() {
  const { userSongs } = useAuthContext();
  return (
    <div>
      <h1 className="font-bold text-lg lg:text-3xl mb-5">Songs</h1>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Song ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Audio URL
              </th>
              <th scope="col" className="px-6 py-3">
              </th>
            </tr>
          </thead>
          <tbody>
            {
              userSongs.length ?
                userSongs.sort((a, b) => {
                  return b.creationTime - a.creationTime
                }).map(songData => (
                  <tr key={songData.id} className="bg-gray-800 border-gray-700 hover:bg-gray-600">
                    <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-white">
                      {songData.data?.song_id || "N/A"}
                    </th>
                    <td className="px-6 py-4">
                      {songData.data.title || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <Link target="_blank" referrerPolicy="no-referrer" href={songData.data.audio_url}>{songData.data.audio_url.slice(0, 7)}...{songData.data.audio_url.slice(-8)}</Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="font-medium">
                        <CiMenuKebab size={20} />
                      </button>
                    </td>
                  </tr>
                )) :
                <tr className="bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <td colSpan={4} className="text-center px-6 py-4 text-lg">No songs found!</td>
                </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}