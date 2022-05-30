import { Component, Input } from "@angular/core";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  @Input() theme = "";

  showMobileMenu: boolean = false;

  setShowMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  changeTheme() {
    document.body.classList.toggle("dark");
  }
}
