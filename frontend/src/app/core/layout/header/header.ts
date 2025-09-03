import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { cilAccountLogout, cilContact } from '@coreui/icons';

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

  constructor() {
    this.#iconSet.icons = {
      cilAccountLogout,
      cilContact,
    };
  }
}
