import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isReady = false;
  private ffmpeg;

  constructor() {
    // To create an instance of ffmpeg, also by passing log true, we can catch the logs on dev console
    this.ffmpeg = createFFmpeg({log: true});
  }

  async init() {
    // First step: Download the Web Assembly file for accessing the ffmpeg

    // Check to see if we have already file and access to ffmpeg
    if(this.isReady) {
      // FfMpeg has been loaded already
      return;
    }

    // IF not: Download the file and load
    await this.ffmpeg.load();

    // Set the flag to true: to note its already loaded and prevent ffmpeg from reloading checking in the if block above
    this.isReady = true;
  }

  async getScreenshots(file: File) {

    // Convert the file to Binary data for storage, use ffmpeg fetfile function
    const data = await fetchFile(file);


    // Store the Video File in ffmpeg seperate memory storage, usinf ffmpeg FS fucntion
    // FS - short for file system - gives access to packages independent memory system: to read and write, delete files
    // Takes in 3 arguments, Command, file name , binary data file
    this.ffmpeg.FS('writeFile', file.name, data)
  }
}
