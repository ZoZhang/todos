import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoService } from './services/todo.service';
import { QRCodeModule } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    SpeechToTextComponent
  ],
    imports: [
        BrowserModule, FormsModule, QRCodeModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyDuegErXnqhY4Tcd0_JduktNXLNldTsW9w'
        })
    ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
