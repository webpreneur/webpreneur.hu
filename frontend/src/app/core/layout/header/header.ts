import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Auth } from '../../auth/auth';
import {
  AvatarComponent,
  CollapseDirective,
  ContainerComponent,
  DropdownComponent,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  NavbarBrandDirective,
  NavbarComponent,
  NavbarNavComponent,
  NavbarTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
} from '@coreui/angular';

import { IconDirective, IconSetService } from '@coreui/icons-angular';
import { cilAccountLogout, cilContact, cilBasket } from '@coreui/icons';

@Component({
  selector: 'webpreneur-header',
  providers: [IconSetService],
  imports: [
    AvatarComponent,
    CollapseDirective,
    ContainerComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    IconDirective,
    NavItemComponent,
    NavLinkDirective,
    NavbarBrandDirective,
    NavbarComponent,
    NavbarNavComponent,
    NavbarTogglerDirective,
    RouterLink,
],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  #iconSet = inject(IconSetService);
  #platformId = inject(PLATFORM_ID);
  #authService = inject(Auth);

  get isBrowser(): boolean {
    return isPlatformBrowser(this.#platformId);
  }

  get isAuthenticated() {
    return this.#authService.isAuthenticated;
  }

  logout(): void {
    this.#authService.logout().subscribe();
  }

  constructor() {
    this.#iconSet.icons = {
      cilAccountLogout,
      cilContact,
      cilBasket,
    };
  }
}
