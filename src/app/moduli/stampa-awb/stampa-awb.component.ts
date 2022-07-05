import { Component, ViewChild, ElementRef } from "@angular/core";
import { FormGroup, FormControl, FormArray, FormBuilder } from "@angular/forms";

@Component({
  selector: "app-stampa-awb",
  templateUrl: "./stampa-awb.component.html",
})
export class StampaAwbComponent {
  title = "FormArray Example in Angular Reactive forms";

  skillsForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.skillsForm = this.fb.group({
      name: "",
      skills: this.fb.array([]),
    });
  }

  get skills(): FormArray {
    return this.skillsForm.get("skills") as FormArray;
  }

  newSkill(): FormGroup {
    return this.fb.group({
      skill: "",
      exp: "",
    });
  }

  addSkills() {
    this.skills.push(this.newSkill());
  }

  removeSkill(i: number) {
    this.skills.removeAt(i);
  }

  onSubmit() {
    //console.log(this.skillsForm.value);
  }
}

export class country {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
