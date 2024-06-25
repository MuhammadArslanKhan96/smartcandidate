import { uploadAndGetURL } from "@/helpers/storageHelper";
import { NextResponse } from "next/server";

export async function POST(_request: Request) {

  const { url, song_id } = await _request.json();

  const blob = (await fetch(url).then(r => r.blob()));
  console.log(blob.size);
  const songURL = await uploadAndGetURL(blob, song_id);

  return NextResponse.json({ songURL });
}