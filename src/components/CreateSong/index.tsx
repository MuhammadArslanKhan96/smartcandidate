import { useAuthContext } from '@/context/AuthContext';
import { useTranslation } from '@/context/TranslationContext';
import { db } from '@/utils/firebase';
import axios from 'axios';
import { addDoc, collection } from 'firebase/firestore';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

const CreateSong = () => {
  const [makeInstrumental, setMakeInstrumental] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUserSongs } = useAuthContext();
  const { translations } = useTranslation();

  const handleCreateSong = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { songIdea }: any = Object.fromEntries(new FormData(e.currentTarget));

    if (!songIdea) return toast.error(translations["fillAllTheFields"])

    if (songIdea.length > 200) {
      return toast.error(translations["songIdeaLengthExceeded"]);
    }

    try {
      setLoading(true);

      const songApiData = await axios.post("https://api.sunoaiapi.com/api/v1/gateway/generate/gpt_desc", {
        gpt_description_prompt: songIdea,
        make_instrumental: makeInstrumental,
      }, {
        headers: {
          "api-key": "cn5cIfEg1rJ6EoKzNpIwOmxkkUhwkDEe",
        }
      }).then(r => r.data.data);

      const songBaseUrl = `https://cdn1.suno.ai`;

      const newData = songApiData.map(song => ({ ...song, audio_url: `${songBaseUrl}/${song.song_id}.mp3` }));

      const data = newData[0];

      if (!data) return toast.error(translations["somethingWentWrong"] + " !!");

      const songData = await new Promise(async resolve => {
        const interval = setInterval(async () => {
          const songD = await axios.get("https://api.sunoaiapi.com/api/v1/gateway/query?ids=" + data.song_id, {
            headers: {
              "api-key": "cn5cIfEg1rJ6EoKzNpIwOmxkkUhwkDEe",
            }
          }).then(r => r.data)


          if (songD[0].status === "complete") {
            clearInterval(interval);
            resolve(songD);
          }
        }, 52500);
      });


      const newDoc = await addDoc(collection(db, "songs"), {
        data: { ...data, ...songData[0] },
        user: user?.email,
        creationTime: new Date().getTime(),
        prompt: songIdea,
      });

      setUserSongs(prev => ([
        ...prev,
        {
          data: { ...data, ...songData[0] },
          user: user?.email,
          creationTime: new Date().getTime(),
          id: newDoc.id,
          prompt: songIdea
        }
      ]))

      toast.success(translations["createSuccess"] + " !!")


    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "");
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className='py-10'>
      <h1 className="font-bold text-lg lg:text-3xl mb-5">{translations["createJingle"]}</h1>
      <form onSubmit={handleCreateSong} className="my-4 flex flex-col gap-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="songIdea" className='font-medium text-base lg:text-lg'>{translations["songIdea"]}</label>
          <textarea name="songIdea" id="songIdea" rows={5} className='bg-gray-500 border-none outline-none px-6 py-8 rounded-lg resize-none w-full' />
        </div>


        <label className='w-full flex gap-x-2'>
          <input type="checkbox" checked={makeInstrumental} onChange={e => setMakeInstrumental(e.target.checked)} />
          <p>Instrumental ?</p>
        </label>

        <div className="flex items-center justify-center w-full">
          <button disabled={loading} type='submit' className='py-4 bg-blue-600 rounded-xl border border-blue-600 hover:bg-transparent text-white hover:text-blue-600 disabled:cursor-not-allowed transition-all duration-300 ease-in-out w-3/4'>
            {loading ? translations["loading"] : translations["makeSong"]}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateSong
