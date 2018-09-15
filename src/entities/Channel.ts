import Stream from './Stream';

export default class Channel {
  public online: boolean | null = null;
  public stream: Stream | null = null;

  constructor(public id: number, public username: string, public nickname: string) {}

  public url(): string {
    return `https://twitch.tv/${this.username}`;
  }

  public markAsOnline(stream: Stream): void {
    this.online = true;
    this.stream = stream;
  }

  public markAsOffline(): void {
    this.online = false;
    this.stream = null;
  }
}
