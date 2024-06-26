import { useAuthContext } from '@/context/AuthContext';
import { useTranslation } from '@/context/TranslationContext';
import { db } from '@/utils/firebase';
import axios from 'axios';
import { addDoc, collection } from 'firebase/firestore';
import { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';

const Rhythms = {
  "Sertanejo": "sertanejo",
  "Sertanejo 2": "sertanejo, uplifting",
  Pagode: "pagode",
  "Hip Hop": "hip hop, bass, trap",
  "Hip Hop 2": "hip hop vibrant",
  "Samba": "samba, bossa nova",
  "Samba 2": "samba, lively",
  Funk: "trap brasileiro, bass"
}

const CreateSong = () => {
  // const [song, setSong] = useState<any>();
  const [makeInstrumental, setMakeInstrumental] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUserSongs } = useAuthContext();
  const { translations, selectedLang } = useTranslation();

  // const handleTextToSpeech = async e => {
  //   e.preventDefault();

  //   const { songIdea } = Object.fromEntries(new FormData(e.target));

  //   try {
  //     const url = 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM';
  //     const apiKey = '8252f6d6204c308cee9fc6b9739ef0fb';

  //     const postData = {
  //       text: songIdea,
  //       model_id: "eleven_multilingual_v2",
  //       voice_settings: {
  //         stability: 0.5,
  //         similarity_boost: 0.5
  //       }
  //     };

  //     const headers = {
  //       'Content-Type': 'application/json',
  //       'xi-api-key': apiKey
  //     };

  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: headers,
  //       body: JSON.stringify(postData)
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const fileStream = response.body.getReader();

  //     const chunks = [];
  //     while (true) {
  //       const { done, value } = await fileStream.read();
  //       if (done) break;
  //       chunks.push(value);
  //     }

  //     const blob = new Blob(chunks, { type: 'audio/mpeg' });
  //     const file = new File([blob], 'output.mp3', { type: 'audio/mpeg' });
  //     setSong(file);

  //     toast.success('Song created successfully!');

  //   } catch (error) {
  //     toast.error(error.response.data.message || error.message || "");
  //   }


  // }

  const handleCreateSong = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { songIdea, selectedRhythm }: any = Object.fromEntries(new FormData(e.currentTarget));

    if (!songIdea || !selectedRhythm) return toast.error(translations["fillAllTheFields"])

    if (songIdea.length > 200) {
      return toast.error(translations["songIdeaLengthExceeded"]);
    }

    try {
      setLoading(true);

      const songApiData = await axios.post("https://api.sunoaiapi.com/api/v1/gateway/generate/gpt_desc", {
        gpt_description_prompt: `Create a catchy ${selectedRhythm} jingle in ${selectedLang === "pt" ? "Brazilian Portuguese" : "US English"} for ${user?.name}, candidate number ${user?.candidate_number}, with the slogan "${songIdea}" highlighting his bond with the people and the city.`,
        // gpt_description_prompt: `Create a catchy ${selectedRhythm} jingle in ${selectedLang === "pt" ? "Brazilian Portuguese" : "US English"} for ${user?.gender || "male"} singer promoting ${user?.name}, candidate number ${user?.candidate_number}, with the slogan "${songIdea}" Emphasize his connection to the people and the city.`,
        make_instrumental: makeInstrumental,
      }, {
        headers: {
          "api-key": "cn5cIfEg1rJ6EoKzNpIwOmxkkUhwkDEe",
        }
      }).then(r => r.data.data);

      const songBaseUrl = `https://cdn1.suno.ai`;

      const newData = songApiData.map(song => ({ ...song, audio_url: `${songBaseUrl}/${song.song_id}.mp3` }));

      // newData.forEach(async (data: any) => {

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

      // });



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


        <div className="flex justify-between gap-2">
          <label className='w-full'><input type="checkbox" checked={makeInstrumental} onChange={e => setMakeInstrumental(e.target.checked)} /> Instrumental ?</label>
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="selectedRhythm" className='font-medium text-base lg:text-lg'>{translations["songRhythm"]}</label>
            <select name="selectedRhythm" id="selectedRhythm" className='bg-gray-500 border-none outline-none px-2 py-4 rounded-lg resize-none w-full'>
              <option value="">{translations["select"]}</option>
              {
                Object.entries(Rhythms).map(([key, value]) => (
                  <option value={value} key={key}>{key}</option>
                ))
              }
            </select>
          </div>
        </div>

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
