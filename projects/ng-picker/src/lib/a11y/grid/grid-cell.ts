import { Directive, ElementRef, inject, output } from '@angular/core';

export enum GrdiNavigationDirection {
  LEFT = 'left',
  RIGHT = 'right',
  UP = 'up',
  DOWN = 'down',
  HOME = 'home',
  END = 'end',
  PAGE_UP = 'page_up',
  PAGE_DOWN = 'page_down',
}

@Directive({
  selector: '[pkGridCell]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class GridCell {
  private _element = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;

  navigate = output<{
    direction: GrdiNavigationDirection;
  }>();
  onKeydown(event: KeyboardEvent): void {
    const { key } = event;

    switch (key) {
      case 'ArrowLeft':
        this.navigate.emit({
          direction: GrdiNavigationDirection.LEFT,
        });
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.navigate.emit({
          direction: GrdiNavigationDirection.RIGHT,
        });
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.navigate.emit({
          direction: GrdiNavigationDirection.UP,
        });
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.navigate.emit({
          direction: GrdiNavigationDirection.DOWN,
        });
        event.preventDefault();
        break;
      case 'Home':
        this.navigate.emit({
          direction: GrdiNavigationDirection.HOME,
        });
        event.preventDefault();
        break;
    }
  }

  focus() {
    this._element.focus();
  }
}
