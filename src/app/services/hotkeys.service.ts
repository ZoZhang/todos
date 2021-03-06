/**
 * DIY Keyboard Shortcuts in Your Angular Application
 * reference: https://netbasal.com/diy-keyboard-shortcuts-in-your-angular-application-4704734547a2
 */

import {Inject, Injectable} from '@angular/core';
import {EventManager} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';
import {Observable} from 'rxjs';

interface Options {
  element: any;
  keys: string;
  description: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class Hotkeys {
  hotkeys = new Map();
  defaults: Partial<Options> = {
    element: this.document
  };

  constructor(private eventManager: EventManager,
              @Inject(DOCUMENT) private document: Document) {
  }

  addShortcut(options: Partial<Options>) {
    const merged = { ...this.defaults, ...options };
    const event = `keydown.${merged.keys}`;

    if (merged.description) {
      this.hotkeys.set(merged.keys, merged.description);
    }

    return new Observable(observer => {
      const handler = (e) => {
        e.preventDefault();
        observer.next(e);
      };

      const dispose = this.eventManager.addEventListener(merged.element, event, handler);

      return () => {
        dispose();
        this.hotkeys.delete(merged.keys);
      };
    });
  }
}
