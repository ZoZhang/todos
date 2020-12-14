import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import {TodoService} from './services/todo.service';
import {FormsModule} from '@angular/forms';
import { SpeechToTextComponent } from './speech-to-text/speech-to-text.component';
import {QRCodeModule} from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoItemComponent,
    SpeechToTextComponent
  ],
    imports: [
        BrowserModule, FormsModule, QRCodeModule
    ],
  providers: [TodoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
