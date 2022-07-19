import { HttpClient } from "@angular/common/http";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StoreService } from "src/app/store.service";
import { StatusService } from "../../status.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
})
export class NavbarComponent implements OnInit {
  constructor(
    public store: StoreService,
    private router: Router,
    private http: HttpClient
  ) {
    // this.theme = "bg-[" + this.status.response.mainColor + "]";
  }

  ngOnInit(): void {
    this.response = this.store.configuration;
    this.theme = "#" + this.response.mainColor;
    this.lenguages = this.response.i18n;
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url.slice(1).split("?")[0];
    });
  }

  response: any = {};

  // @Input() theme = "";
  // theme = "bg-[" + this.service.response.mainColor + "]";
  // theme = "bg-[#22aaa2]";
  // theme = "bg-[" + this.service.response.mainColor + "]";
  banner = /* this.service.response.banner | */ "#abc";
  currentUrl = "";
  theme = "";
  lenguages: Array<string> = [];
  showMobileMenu: boolean = false;

  setShowMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  changeTheme() {
    document.body.classList.toggle("dark");
  }

  handleSetTranslations(lang: string) {
    this.currentUrl = this.router.url.slice(1).split("?")[0];
    this.router.navigate([this.currentUrl], { queryParams: { lang: lang } });
    console.log(lang);
  }
}
