import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// The root component is now just a thin router host.
// Nav, Footer, and layout are handled by the Shell layout route component
// (src/app/core/layout/shell/shell.ts), which is lazy-loaded for all
// app pages. The Login page renders without the shell.
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
