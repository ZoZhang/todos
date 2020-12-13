import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TodoService} from './services/todo.service';
import {Hotkeys} from './services/hotkeys.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(private hotkeys: Hotkeys, private todoService: TodoService) {}

  ngOnInit() {
    // Undo
    this.hotkeys.addShortcut({ keys: 'control.z' }).subscribe(this.undo);

    // Redo
    this.hotkeys.addShortcut({ keys: 'control.shift.z' }).subscribe(this.redo);
  }

  undo($event) {

  }

  redo($event) {

  }
}
