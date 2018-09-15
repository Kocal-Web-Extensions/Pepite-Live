export class ExtensionAudio {
  private file: HTMLAudioElement;

  constructor(private name: string, private filename: string) {
    this.file = new Audio(this.filename);
  }

  public play(): void {
    this.file.play();
  }

  public mute(): void {
    this.file.muted = true;
  }

  public unmute(): void {
    this.file.muted = false;
  }

  public onEnd(cb: () => void): void {
    this.file.addEventListener('ended', cb);
  }

  public getName(): string {
    return this.name;
  }

  public setVolume(volume: number) {
    this.file.volume = volume;
  }
}
