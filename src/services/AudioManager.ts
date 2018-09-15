import { ExtensionAudio } from '../entities/ExtensionAudio';
import { SettingsManager } from './SettingsManager';

// tslint:disable-next-line
const mutex = require('locks').createMutex();

export class AudioManager {
  constructor(private audios: ExtensionAudio[], private settingsManager: SettingsManager) {
    this.setupSettingsObserver();

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

  private setupSettingsObserver() {
    this.settingsManager.addObserver((key: string, value: any) => {
      if (key === 'notificationAudio') {
        const shouldMute = !value;
        // tslint:disable-next-line no-console
        console.log(`${shouldMute ? 'Mute' : 'Unmute'} audios...`);
        this.audios.forEach(a => (shouldMute ? a.mute() : a.unmute()));
      } else if (key === 'notificationAudio.volume') {
        // tslint:disable-next-line no-console
        console.log(`Update audios volume... (${value})`);
        this.audios.forEach(a => a.setVolume(parseFloat(value)));
      }
    });
  }
}
