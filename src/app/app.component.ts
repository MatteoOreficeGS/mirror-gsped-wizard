import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  themes = {
    navbar: [
      "bg-gradient-to-br from-purple-600 to-blue-500",
      "bg-gradient-to-r from-blue-500",
      "bg-gradient-to-br from-green-600 to-green-300",
      "bg-gradient-to-br from-cyan-200 to-rose-500",
      "bg-gradient-to-br from-purple-300 to-slate-200",
      "bg-gradient-to-r from-indigo-500 via-cyan-400 to-green-500 dark:from-purple-900 dark:to-purple-700",
    ],
    buttons: [
      "bg-gradient-to-br from-purple-300 to-slate-200",
      "bg-gradient-to-r from-blue-500",
      "bg-gradient-to-r from-indigo-500 via-cyan-400 to-green-500 dark:from-purple-900 dark:to-purple-700",
      "bg-gradient-to-br from-green-600 to-green-300",
      "bg-gradient-to-br from-cyan-200 to-rose-500",
      "bg-gradient-to-br from-purple-600 to-blue-500",
    ],
  };

  navbarTheme = this.themes.navbar[0];
  buttonsTheme = this.themes.buttons[0];

  setTheme(type: number) {
    this.navbarTheme = this.themes.navbar[type];
    this.buttonsTheme = this.themes.buttons[type];
  }
}
