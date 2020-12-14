# TodoList - Angular

### Demo
https://todolist-298612.firebaseapp.com/

### Utilisation
Il faut installer d'abord `node` && `npm` dans la dernier version.

Il faut aussi installez `angular8`

Et après, lance la commande `npm install && npm start` pour utiliser dans le local.

## Fonctionnalités accomplis
* [x] Effacer Tout
* [x] Effacer taches terminés
* [x] Sérialisation / désérialisation des données localement (Local Storage) - Pour sauvegarder les données localement
* [x] Undo / Redo (Annuler / Refaire)
* [x] Utilisation de reconnaissance vocale
* [x] Copie de listes par QR-code
* [x] Géolocalisation des choses à faire (carte google map) 
* [x] Identification des utilisateurs et synchronisation des données avec FireBase
* [x] Version responsive (application qui s'adapte aux tailles d'écran, comme un smartphone)

## Problème rencontré

### 1. input double en 2 events(blur、keydown.enter)
Quand on fait deux events sur la même input comme ci-dessous:
```
 <input #newLab
               class = "hidden"
               value   = {{item.label}}
               (blur)="viewMode(item, newLab)"
               (keydown.enter)="viewMode(item, newLab)"
        />
```
Lorsqu'on fait l'entre, il va toucher les deux events, c'est à dire qu'il fait deux fois l'appel  `viewMode(item, newLab)`

Finalement, je trouve la solution :
```
 <input #newLab
               class = "hidden"
               value   = {{item.label}}
               (blur)="viewMode(item, newLab)"
               (keydown.enter)="newLab.blur()"
        />
```
        
### 2. Hotkeys Service 
J'ai trouve une référencé de service `hotkeys` par [cet article](https://netbasal.com/diy-keyboard-shortcuts-in-your-angular-application-4704734547a2) pour faire la fonctionalité `undo/redo`

Quand je l'utilise dans le fichier `.ts` comme la suite.
J'aimerai changer le contenue de `todoList.items` à tester, Mais il ne marche pas du tout, même si je l'utilise dans `todo-list.component.ts`

### app.component.ts
```
import {Hotkeys} from './services/hotkeys.service';

constructor(private todoService: TodoService, private hotkeysService: Hotkeys) { }

  ngOnInit() {

    // Undo
        this.hotkeysService.addShortcut({ keys: 'control.z' }).subscribe(x => this.todoService.undoTodolist(this.todoService));
  }
```
### todo.service.ts
```
 undoTodolist(service: TodoService): void {
    const tdl = service.todoListSubject.getValue();
    service.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: []
    });
  }
```
Finalement, j'utilise la méthode `@HostListener('document:keydown.control.z')` dans les templates, et tout va bien.     

### 3. Google Map
Au début, Je l'ai fais avec le module `@agm/core` en regardant la rérérencé: https://medium.com/javascript-in-plain-english/integrate-google-maps-to-your-angular-application-step-by-step-guide-3604aadb76d1

l'application marche, mais il y a des erreurs de namespace introuvable sur google map comme la suivante.

```
 error TS2688: Cannot find type definition file for 'googlemaps'.
    node_modules/@agm/core/lib/services/managers/polyline-manager.d.ts(23,48): error TS2503: Cannot find namespace 'google'.
    node_modules/@agm/core/lib/services/managers/polyline-manager.d.ts(25,79): error TS2503: Cannot find namespace 'google'.
```

Et je ne sais pas pourquoi, quand je voulais publier sur firebase, l'application ne peut pas compiler...

Et alors, je l'ai refais avec google js api en utilisant le module `@types/googlemaps`;
la référencé: https://dev.to/devpato/setup-google-map-in-angular-app-the-pro-way-3m9p

    
Et puis, la localisation n'est pas correcte car je n'ai pas activé une facture par Google Cloud Project. comme le message suivant dans le console.

```
Geocoding Service: You must enable Billing on the Google Cloud Project at https://console.cloud.google.com/project/_/billing/enable Learn more at https://developers.google.com/maps/gmp-get-started
```

## Démonstration

##### PC
![](https://i.imgur.com/4KDn1wD.jpg)

##### Responsive
![](https://i.imgur.com/HyqiTpv.jpg)

