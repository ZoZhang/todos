import {Component, HostListener, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoService} from '../services/todo.service';
import {Hotkeys} from '../services/hotkeys.service';

@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    styleUrls: ['./todo-list.component.css']
})

export class TodoListComponent implements OnInit {

    private todoList: TodoListData;

    constructor(private todoService: TodoService, private hotkeysService: Hotkeys) {
        todoService.getTodoListDataObservable().subscribe( tdl => this.todoList = tdl );
    }

    // initialis les hotkeys
    ngOnInit() {
        // Undo
        // this.hotkeysService.addShortcut({ keys: 'control.z' }).subscribe(x => this.undoTodolist(this.todoService));

        // Redo
        // this.hotkeys.addShortcut({ keys: 'control.shift.z' }).subscribe(this.todoService.redoTodolist);
    }

    get label(): string {
        return this.todoList.label;
    }

    get todoCount(): number {
        if (this.todoList.items) {
            return this.todoList.items.filter(I => I.isDone === false && I.isDeleted === false).length;
        }
        return 0;
    }

    itemShow(type: string) {
        this.todoService.todoListFiltreStatus = type;
    }

    setDoneAllItems() {
        if (this.todoList.items) {
            this.todoService.todoListSettingAllItemStatus = !this.todoService.todoListSettingAllItemStatus;
            this.todoList.items.map(item => this.todoService.setItemsDone(this.todoService.todoListSettingAllItemStatus, item));
        }
    }

    appendItem(input: any) {

      if (typeof input !== 'object') {
          return;
      }

      const newLabel = input.value;

      if (newLabel.length <= 0) {
          input.placeholder = 'Vous devez entrer au moins un caractère ！';
          return;
      }

      this.todoService.appendItems({
          label: newLabel,
          isDone: false,
          isDeleted: false
      });
      input.value = '';
    }

    itemDoneRemove() {
        console.log(this.todoService.todoListExistItemDone);
        if (this.todoList.items) {
            this.todoList.items.filter(item => item.isDone === true && this.todoService.removeItems(item));
        }
    }

    itemAllRemove() {
        if (this.todoList.items) {
            this.todoService.removeAllItems();
        }
    }

    @HostListener('document:keydown.control.z')
    undoTodolist() {
        this.todoService.restoreTodoList('undo');
    }

    @HostListener('document:keydown.control.shift.z')
    redoTodolist() {
        this.todoService.restoreTodoList('redo');
    }
}
