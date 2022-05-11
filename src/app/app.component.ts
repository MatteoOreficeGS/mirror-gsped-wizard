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
      "bg-gradient-to-r from-[#125B50] to-[#FA05E4]",
      "bg-gradient-to-br from-[#f25f50] to-[#FA05E4]",
      "bg-cyan-400",
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
        active: `bg-cyan-400`,
        completed: `bg-gradient-to-br from-[#5FB295] to-[#180CA4]`,
      },
      {
        active: `bg-gradient-to-br from-purple-300 to-slate-200`,
        completed: `bg-gradient-to-br from-[#63B32E] to-[#19AE82]`,
      },
      {
        active: `bg-gradient-to-r from-indigo-500 via-cyan-400 to-green-500 dark:from-purple-900 dark:to-purple-700`,
        completed: `bg-gradient-to-br from-[#2B99C9] to-[#BD1002]`,
      },
    ],
  };

  navbarTheme = this.themes.navbar[0];
  buttonsTheme = this.themes.buttons[0];

  setTheme(type: number) {
    this.navbarTheme = this.themes.navbar[type];
    this.buttonsTheme = this.themes.buttons[type];
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
