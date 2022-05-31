import { Component, Input } from "@angular/core";
import { StatusService } from "../status.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent {
  constructor(public status: StatusService) {
    // this.theme = "bg-[" + this.status.response.configuration.mainColor + "]";
  }

  // @Input() theme = "";
  // theme = "bg-[" + this.status.response.configuration.mainColor + "]";
  // theme = "bg-[#22aaa2]";
  // theme = "bg-[" + this.status.response.configuration.mainColor + "]";
  theme = this.status.response.configuration.mainColor;
  banner = this.status.response.configuration.banner;

  showMobileMenu: boolean = false;

  setShowMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  changeTheme() {
    document.body.classList.toggle("dark");
  }
}
