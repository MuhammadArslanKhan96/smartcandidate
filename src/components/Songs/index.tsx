"use client";
import { useAuthContext } from "@/context/AuthContext";
import SongRow from "./SongRow";
import { useTranslation } from "@/context/TranslationContext";

export default function Songs() {
  const { userSongs } = useAuthContext();
  const { translations } = useTranslation();

  return (
    <div>
      <h1 className="font-bold text-lg lg:text-3xl mb-5">{translations["songs"]}</h1>
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
              {/* <th scope="col" className="px-6 py-3">
                Audio URL
              </th> */}
              <th scope="col" className="px-6 py-3 text-end">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {
              userSongs.length ?
                userSongs.sort((a, b) => {
                  return b.creationTime - a.creationTime
                }).map(songData => {
                  return (
                    <SongRow songData={songData} key={songData?.id} />
                  )
                }) :
                <tr className="bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <td colSpan={3} className="text-center px-6 py-4 text-lg">No songs found!</td>
                </tr>
            }
          </tbody>
        </table>
      </div>

    </div>
  )
}