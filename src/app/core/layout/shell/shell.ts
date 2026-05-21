import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Nav } from '../nav/nav/nav';
import { Footer } from '../footer/footer';

/**
 * Shell is the authenticated layout wrapper.
 * It owns the sticky header (Nav) and the footer.
 * All protected routes are children of this component via the router.
 *
 * Login sits outside this shell so it gets a clean, full-screen layout.
 */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Nav, Footer],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {}
