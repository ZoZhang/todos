import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class TodoService {

  // initialie l'état filtre
  todoListFiltreStatus = 'all';

  // initiale l'état items
  todoListExistItem = false;

  // initiale l'état supprimé terminé
  todoListExistItemDone = false;

  // initialise l'état du toggle all
  todoListSettingAllItemStatus = false;

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
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone, isDeleted: I.isDeleted}) )
    });

    this.toLocalStorage();
  }

  setItemsDone(isDone: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone, isDeleted: I.isDeleted}) )
    });

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
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone: I.isDone, isDeleted: true}) )
    });

    this.toLocalStorage();
  }

  removeAllItems() {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.map(I => ({label: I.label, isDone: I.isDone, isDeleted: true}))
    });

    this.toLocalStorage();
  }

  getLocalStorage() {
    return this.localStorage.getItem(this.localStorageKey);
  }

  toLocalStorage() {
    const tdl = this.todoListSubject.getValue();
    this.localStorage.setItem(this.localStorageKey, tdl.items);

    this.initialiseItemsStatus();
  }

  initialiseItemsStatus() {
    const tdl = this.todoListSubject.getValue();
    const localStorageItems = this.getLocalStorage();

    if ('object' === typeof localStorageItems) {
      tdl.items = localStorageItems.getValue();
    }

    // mise à jour l'état items
    this.todoListExistItemDone = tdl.items.filter((item) => {
      return item.isDone === true && item.isDeleted === false;
    }).length >= 1;

    this.todoListExistItem = tdl.items.filter((item) => {
      return item.isDeleted === false;
    }).length >= 1;
  }

}
