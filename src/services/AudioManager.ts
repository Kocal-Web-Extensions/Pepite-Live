import { ExtensionAudio } from '../entities/ExtensionAudio';

// tslint:disable-next-line
const mutex = require('locks').createMutex();

export class AudioManager {
  constructor(private audios: ExtensionAudio[]) {
    this.audios.forEach(audio =>
      audio.onEnd(() => {
        if (mutex.isLocked) {
          mutex.unlock();
        }
      })
    );
  }

  public play(audioName: string): void {
    const audio = this.getAudioOrThrow(audioName);

    mutex.lock(() => audio.play());
  }

  private getAudioOrThrow(name: string): ExtensionAudio {
    const audio = this.audios.find(a => a.getName() === name);

    if (audio) {
      return audio;
    }

    throw new Error(`Impossible de trouver l'audio « ${name} ».`);
  }
}
