import { Component, OnInit } from '@angular/core';
import {VoiceRecognitionService} from '../services/voice-recognition.service';
import {TodoService} from '../services/todo.service';

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.css']
})
export class SpeechToTextComponent implements OnInit {

  public voiceStart: boolean;

  constructor(private todoService: TodoService, private voiceRecognitionService: VoiceRecognitionService) { }

  ngOnInit() {
    this.voiceStart = false;
    this.voiceRecognitionService.init();
  }

  startVoiceService() {
    this.voiceStart = true;
    this.voiceRecognitionService.start();
  }

  stopVoiceService() {
    this.voiceStart = false;
    this.voiceRecognitionService.stop();

    if (this.voiceRecognitionService.isStoppedSpeechRecog && this.voiceRecognitionService.text) {
        this.addTextToItems(this.voiceRecognitionService.text.trim());
    }
  }

  addTextToItems(voiceLabel: string) {

    if (!voiceLabel || voiceLabel === 'undefined') {
      return;
    }

    this.todoService.appendItems({
      label: voiceLabel,
      isDone: false,
      isDeleted: false
    });
  }
}
