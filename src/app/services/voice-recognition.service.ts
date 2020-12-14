/**
 * Creating a Speech Recognition App in Angular
 * reference: https://codeburst.io/creating-a-speech-recognition-app-in-angular-8d1fd8d977ca
 */

import { Injectable } from '@angular/core';
declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  public text = '';
  tempWords;

  recognition =  new webkitSpeechRecognition();
  isStoppedSpeechRecog = false;

  constructor() { }

  init() {

    this.recognition.interimResults = true;
    this.recognition.lang = 'fr-FR';

    this.recognition.addEventListener('result', (e) => {
      const transcript = Array.from(e.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
      this.tempWords = transcript;
      console.log(transcript);
    });
  }

  start() {
    this.text = '';
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log('Speech recognition started');
    this.recognition.addEventListener('end', (condition) => {
      if (this.isStoppedSpeechRecog) {
        this.recognition.stop();
      } else {
        this.wordConcat();
        this.recognition.start();
      }
    });
  }

  stop() {
    this.isStoppedSpeechRecog = true;
    this.wordConcat();
    this.recognition.stop();
    console.log('End speech recognition');
  }

  wordConcat() {
    this.text = this.text + ' ' + this.tempWords;
    this.tempWords = '';
  }
}
