import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EventLoopService } from './shared/services/event-loop.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'klife_world';
}
