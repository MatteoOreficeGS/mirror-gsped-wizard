import { AbstractControl } from "@angular/forms";

export function ValidateEmail(
  control: AbstractControl
): { [key: string]: any } | null {
  const validRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z_A-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
  if (control.value.length > 0) {
    if (!control.value.match(validRegex)) {
      return { emailInvalid: true };
    }
  }
  return null;
}

export function ValidatePhone(
  control: AbstractControl
): { [key: string]: any } | null {
  const validRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/i;

  if (!control.value.match(validRegex)) {
    return { phoneInvalid: true };
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
    return { packageInvalid: "Field is required" };
  }
  if (String(value).split(".").length - 1 > 1) {
    return { packageInvalid: "Invalid character" };
  }
  value = parseFloat(value);
  if (isNaN(value)) {
    return { packageInvalid: "Invalid character" };
  }
  if (value < min) {
    return { packageInvalid: "Too low value" };
  }
  if (value > max) {
    return { packageInvalid: "Too high value" };
  }
  return null;
}

export function ValidateInsurance(
  control: AbstractControl
): { [key: string]: any } | null {
  let value = control.value;
  const min = 0;
  const max = 10000; //TODO chiedere il massimo dell'assicurazione
  value = value.replaceAll(",", ".");
  if (String(value).length === 0) {
    return null;
  }
  if (String(value).split(".").length - 1 > 1) {
    return { InsuranceInvalid: "Invalid character" };
  }
  value = parseFloat(value);
  if (isNaN(value)) {
    return { InsuranceInvalid: "Invalid character" };
  }
  if (value < min) {
    return { InsuranceInvalid: "Too low value" };
  }
  if (value > max) {
    return { InsuranceInvalid: "Too high value" };
  }
  return null;
}
