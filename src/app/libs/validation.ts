import { AbstractControl } from "@angular/forms";

export function ValidateEmail(
  control: AbstractControl
): { [key: string]: any } | null {
  const validRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-z_A-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
  if (control.value && control.value.length > 0) {
    if (!control.value.match(validRegex)) {
      return { lbl_invalid_characters: true };
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
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{1,14}$/i;
  if (control.value.length < 7) {
    return { minlength: true };
  }
  if (control.value.length > 20) {
    return { lbl_too_long: true };
  }
  if (!control.value.match(validRegex)) {
    return { lbl_invalid_characters: true };
  }
  return null;
}

export function ValidatePackageDimension(
  control: AbstractControl
): { [key: string]: any } | null {
  let value = control.value;
  const min = 1;
  const max = 100;
  return ValidatePackage(value, min, max);
}

export function ValidatePackageWeight(
  control: AbstractControl
): { [key: string]: any } | null {
  let value = control.value;
  const min = 0.5;
  const max = 10;
  return ValidatePackage(value, min, max);
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
    return { lbl_invalid_characters: true };
  }
  value = parseFloat(value);
  if (isNaN(value)) {
    return { lbl_invalid_characters: true };
  }
  if (value < min) {
    return { lbl_too_low_value: true };
  }
  if (value > max) {
    return { lbl_too_high_value: true };
  }
  return null;
}

export function ValidateEsteroCountry(
  control: AbstractControl
): { [key: string]: any } | null {
  let value = control.value;
  if (value.length > 2) {
    return { lbl_too_high_value: true };
  }
  if (value.length < 2) {
    return { lbl_too_low_value: true };
  }
  if ((value + "").toLowerCase() === "it") {
    return { lbl_country_code_invalid: true };
  }
  return null;
}

function ValidatePackage(value: any, min: number, max: number) {
  if (value.length === 0) {
    return { packagesDetails: "required" };
  }
  if (String(value).split(".").length - 1 > 1) {
    return {
      packagesDetails: "lbl_invalid_characters",
    };
  }
  value = parseFloat(value);
  if (isNaN(value)) {
    return {
      packagesDetails: "lbl_invalid_characters",
    };
  }
  if (value < min) {
    return { packagesDetails: "lbl_too_low_value" };
  }
  if (value > max) {
    return { packagesDetails: "lbl_too_high_value" };
  }
  return null;
}
