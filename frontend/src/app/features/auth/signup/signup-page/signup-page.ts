import { Component } from '@angular/core';
import { ContainerComponent } from '@coreui/angular';

import { SignupForm } from '../ui/signup-form/signup-form';

@Component({
  selector: 'webpreneur-signup-page',
  imports: [SignupForm, ContainerComponent],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss'
})
export class SignupPage {

}
