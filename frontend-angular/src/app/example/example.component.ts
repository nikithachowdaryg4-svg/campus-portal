import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-example',
  template: `
    <div style="padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
      <h1>Angular Feature Demo</h1>
      <p>This component demonstrates the use of <code>takeUntilDestroyed()</code>.</p>
      <p>Check the console to see the interval running. It will stop automatically when this component is destroyed.</p>
    </div>
  `,
  standalone: true
})
export class ExampleComponent implements OnInit {
  // Option 1: Using the default DestroyRef from the current context (usually constructor)
  private data$ = interval(1000).pipe(takeUntilDestroyed());

  constructor() {
    this.data$.subscribe(val => {
      console.log('Angular Service Data (takeUntilDestroyed in constructor):', val);
    });
  }

  ngOnInit() {
    // Option 2: If using it outside the constructor, you must pass DestroyRef
    const destroyRef = inject(DestroyRef);
    interval(2000)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe(val => {
        console.log('Angular Service Data (takeUntilDestroyed with inject):', val);
      });
  }
}
