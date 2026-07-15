import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-skeleton',
    standalone: true,
    template: `
    <div class="animate-pulse flex flex-col space-y-4 w-full">
      @for(item of [].constructor(lines); track $index) {
        <div class="h-10 bg-gray-200 rounded w-full"></div>
      }
    </div>
  `
})
export class SkeletonComponent {
    @Input() lines: number = 3; // Mặc định 3 dòng
}