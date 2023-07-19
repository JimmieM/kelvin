import path from 'path';
import player from 'play-sound';
import * as sound from 'sound-play';

export function playAudioFile(filename: string) {
   sound.play(path.resolve(filename), 100);

   sound.play(filename, 100);

   const audioPlayer = player();
   audioPlayer.play(filename, (err: any) => {
      console.warn(err);
      if (err) throw err;
   });
}
