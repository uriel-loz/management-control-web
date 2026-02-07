import { Component } from '@angular/core';
import { UserProfile } from "../user-profile/user-profile";

@Component({
  selector: 'layout-sidebar',
  imports: [UserProfile],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

}
