import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-modal-info",
  templateUrl: "./modal-info.component.html",
})
export class ModalInfoComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() message: any;
  @Output() closeModal = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
