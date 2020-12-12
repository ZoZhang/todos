import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class TodoService {

  // initialie l'état todolist
  todoListModeStatus = 'read';

  // initialie l'état filtre
  todoListFiltreStatus = 'all';

  // initialise l'état du toggle all
  todoListSettingAllItemStatus = false;

  // initiale l'état supprimé cochée
  todoListExistItemDone = false;

  localStorageKey   = 'TodoList-Angular';

  localStorage = new LocalStorageService;

  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: []} );

  constructor() { }

  getTodoListDataObservable(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  setItemsLabel(label: string, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}) )
    });

    this.toLocalStorage();
  }

  setItemsDone(isDone: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}) )
    });
    // mise à jour l'état supprimé cochée
    this.todoListExistItemDone = true;

    this.toLocalStorage();
  }

  appendItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: [...tdl.items, ...items]
    });
    this.toLocalStorage();
  }

  removeItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });
  }

  toLocalStorage() {
    const tdl = this.todoListSubject.getValue();
    this.localStorage.setItem(this.localStorageKey, tdl.items);
  }

}
