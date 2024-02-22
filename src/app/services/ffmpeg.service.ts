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

  async getDeafultScreenshotAtStart(file: File) {

    // Convert the file to Binary data for storage, use ffmpeg fetfile function
    const data = await fetchFile(file);


    // Store the Video File in ffmpeg seperate memory storage, usinf ffmpeg FS fucntion
    // FS - short for file system - gives access to packages independent memory system: to read and write, delete files
    // Takes in 3 arguments, Command, file name , binary data file
    this.ffmpeg.FS('writeFile', file.name, data)

    await this.ffmpeg.run(
      // Input:
          // options to tell which file in the file system
          // '-i' -> option will tell ffmpeg to grab a specific file form the file system
          '-i', file.name,

      // Output Options:
          // '-ss' -> option will allow us to configure the current timestamp, by default timestamp will be begging of the video
          // with this option we can tell the time stamp we want to run against : format 'hh:mm:ss' - 
          // Here we are - grabbing screensot at 1st sec of video
          '-ss', '00:00:01',
          // For capturing the frames, second option is no of frames we want to capture
          '-frames:v', '1',
          // Resizing the image for screenshot - resiging requires filter
          // the resizing function is 'scale=width:height' --> To preserve the aspect ration: we must give -1 for example:
          // Below 510 is width and -1 height is for mainting aspect ratio
          '-filter:v',  'scale=510:-1',

      //Output:
          // To create the screenshot
          // name of the file along with file type
          'output_01.png'
    )
  }

  async getScreenshots(file: File) {

    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data)

    // Grabbing screenshots at 1, 5, 9 seconds
    const seconds = [1, 5, 9]
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        '-i', file.name,
        '-ss', `00:00:0${second}`,
        '-frames:v', '1',
        '-filter:v',  'scale=510:-1',
        `output_0${second}.png`
      );
    })

    // Since run expects list of string[], we will use spread operator to supply list of strings
    await this.ffmpeg.run(...commands);
  }
}
