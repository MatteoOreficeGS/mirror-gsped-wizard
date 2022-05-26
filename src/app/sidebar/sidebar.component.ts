import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  changeTheme() {
    document.body.classList.toggle("dark");
  }

  @Input() theme = "";
}
