import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isReady = false;
  isRunning = false;
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
    // Flag to know if the ffmeg command is running
    this.isRunning = true;

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

    const screenshotFile = this.ffmpeg.FS('readFile', 'output_01.png');
    const screenshotBlob = new Blob([screenshotFile.buffer], {
      type: 'image/png'
    })
    const screenshotUrl = URL.createObjectURL(screenshotBlob);
    this.isRunning = false;
    return [screenshotUrl];
  }

  async getScreenshots(file: File) {
    // Flag to know if the ffmeg command is running
    this.isRunning = true;

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
        '-filter:v', 'scale=510:-1',
        `output_0${second}.png`
      );
    })

    // Since run expects list of string[], we will use spread operator to supply list of strings
    await this.ffmpeg.run(...commands);

    // Preparing screenshots
    const screenshots: string[] = [];

    seconds.forEach((second) => {
      // For fetching the screenshot files
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${second}.png`)
      
      // Converting the 'binary data' retrived form FS into a 'blob'
      // the buffer propert contains the actual raw data of the file which the Blob needs, where as the outer array is reprensentation of data
      const screenshotBlob = new Blob([screenshotFile.buffer], {
        type: 'image/png'
      })

      // Creating urls form a Blob - which we need to render the image on the web
      const screenshotUrl = URL.createObjectURL(screenshotBlob);
      screenshots.push(screenshotUrl);
    })

    this.isRunning = false;
    return screenshots;
  }

  async blobFromURL(url: string){
    // Here we are fetching a file from the file i.e an API requesr kind can be made to fetch the data
    const response = await fetch(url);
    
    // Grab only the blob data form the response object - excluding headers and other infor it might have
    const blob = await response.blob();

    return blob;
  }
}
