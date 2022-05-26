import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-readonly",
  templateUrl: "./readonly.component.html",
  styleUrls: ["./readonly.component.css"],
})
export class ReadonlyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  @Input() label = "";
  @Input() value = "";
}
