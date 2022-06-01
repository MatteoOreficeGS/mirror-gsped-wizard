import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { StatusService } from "./status.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  constructor(public saveStatus: StatusService, private router: Router) {
    this.saveStatus.initResponse();
    console.log(this.saveStatus.response);
    this.router.navigate([
      this.saveStatus.response.configuration.modules[2].moduleName,
    ]);
  }

  themes = {
    navbar: [
      "bg-gradient-to-br from-purple-600 to-blue-500",
      "bg-gradient-to-r from-[#125B50] to-[#FA05E4]",
      "bg-gradient-to-br from-[#f25f50] to-[#FA05E4]",
      "bg-yellow-400",
      "bg-gradient-to-br from-purple-300 to-slate-200",
      "bg-gradient-to-r from-indigo-500 via-cyan-400 to-green-500 dark:from-purple-900 dark:to-purple-700",
    ],
    buttons: [
      {
        active: "bg-gradient-to-br from-purple-600 to-blue-500",
        completed: "bg-gradient-to-br from-blue-500 to-green-200",
      },
      {
        active: "bg-gradient-to-br from-[#125B50] to-[#FA05E4]",
        completed: "bg-gradient-to-br from-blue-500 to-red-200",
      },
      {
        active: `bg-gradient-to-br from-[#f25f50] to-[#FA05E4]`,
        completed: `bg-gradient-to-br from-[#FFDD83] to-[#E3F8FF] dark:to-[#28CC9E]`,
      },
      {
        active: `bg-yellow-400`,
        completed: `bg-gradient-to-br from-[#5FB295] to-[#180CA4]`,
      },
      {
        active: `bg-gradient-to-br from-purple-300 to-slate-200`,
        completed: `bg-gradient-to-br from-[#957FEF] to-[#ffff80]`,
      },
      {
        active: `bg-gradient-to-r from-cyan-400 to-green-500 dark:from-purple-900 dark:to-purple-700`,
        completed: `bg-gradient-to-br from-[#2B99C9] to-[#BD1002]`,
      },
    ],
    primary: [
      "bg-gradient-to-br from-purple-600 to-blue-500",
      "bg-gradient-to-r from-[#125B50] to-[#FA05E4]",
      "bg-gradient-to-br from-[#f25f50] to-[#FA05E4]",
      "bg-yellow-400",
      "bg-gradient-to-br from-purple-300 to-slate-200",
      "bg-gradient-to-r from-indigo-500 via-cyan-400 to-green-500 dark:from-purple-900 dark:to-purple-700",
    ],
    secondary: [
      "bg-gradient-to-br from-blue-500 to-green-200",
      "bg-gradient-to-br from-blue-500 to-red-200",
      `bg-gradient-to-br from-[#FFDD83] to-[#E3F8FF] dark:to-[#28CC9E]`,
      `bg-gradient-to-br from-[#5FB295] to-[#180CA4]`,
      `bg-gradient-to-br from-[#957FEF] to-[#ffff80]`,
      `bg-gradient-to-br from-[#2B99C9] to-[#BD1002]`,
    ],
  };

  primaryTheme = this.themes.primary[3];
  secondaryTheme = this.themes.secondary[3];

  setTheme(type: number) {
    this.primaryTheme = this.themes.primary[type];
    this.secondaryTheme = this.themes.secondary[type];
  }

  /* getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    console.log(color);

    return color;
  } */
}
