import { AbstractControl } from "@angular/forms";

export function ValidateEmail(
  control: AbstractControl
): { [key: string]: any } | null {
  const validRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z_A-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
  if (control.value && control.value.length > 0) {
    if (!control.value.match(validRegex)) {
      return { invalidCharacter: true };
    }
  }
  return null;
}

export function ValidatePhone(
  control: AbstractControl
): { [key: string]: any } | null {
  if (control.value.length === 0) {
    return null;
  }
  const validRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/i;

  if (!control.value.match(validRegex)) {
    return { invalidCharacter: true };
  }
  return null;
}

export function ValidatePackage(
  control: AbstractControl
): { [key: string]: any } | null {
  let value = control.value;
  const min = 0;
  const max = 100;
  value = value.replaceAll(",", ".");
  if (value.length === 0) {
    return { packagesDetails: "required" };
  }
  if (String(value).split(".").length - 1 > 1) {
    return { packagesDetails: "invalidCharacter" };
  }
  value = parseFloat(value);
  if (isNaN(value)) {
    return { packagesDetails: "invalidCharacter" };
  }
  if (value < min) {
    return { packagesDetails: "tooLowValue" };
  }
  if (value > max) {
    return { packagesDetails: "tooHighValue" };
  }
  return null;
}

export function ValidateInsurance(
  control: AbstractControl
): { [key: string]: any } | null {
  let value = control.value;
  const min = 0;
  const max = 10000; //TODO chiedere il massimo dell'assicurazione
  if (String(value).length === 0) {
    return null;
  }
  if (typeof value === "boolean" || typeof value === "number") {
    return null;
  }
  value.replaceAll(",", ".");
  if (String(value).split(".").length - 1 > 1) {
    return { invalidCharacter: true };
  }
  value = parseFloat(value);
  if (isNaN(value)) {
    return { invalidCharacter: true };
  }
  if (value < min) {
    return { tooLowValue: true };
  }
  if (value > max) {
    return { tooHighValue: true };
  }
  return null;
}
