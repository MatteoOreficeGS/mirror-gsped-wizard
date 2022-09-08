import { AbstractControl } from "@angular/forms";
import { StoreService } from "../store.service";

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
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{1,6}$/i;
  if (control.value.length < 7) {
    return { minlength: true };
  }
  if (control.value.length > 15) {
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

export function ValidateCF(
  control: AbstractControl
): { [key: string]: any } | null {
  var validRegex =
    /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/;
  if (control.value && control.value.length > 0) {
    if (!control.value.match(validRegex)) {
      return { lbl_invalid_characters: true };
    } else {
      var i, s, set1, set2, setpari, setdisp;
      const cf = control.value.toUpperCase();
      set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";
      setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";
      s = 0;
      for (i = 1; i <= 13; i += 2)
        s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
      for (i = 0; i <= 14; i += 2)
        s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))));
      if (s % 26 != cf.charCodeAt(15) - "A".charCodeAt(0))
        return { lbl_invalid_characters: true };
    }
  }
  return null;
}

export function ValidatePIva(
  control: AbstractControl
): { [key: string]: any } | null {
  var validRegex = /^[0-9]{11}$/;
  if (control.value && control.value.length > 0) {
    if (!control.value.match(validRegex)) {
      return { lbl_invalid_characters: true };
    } else {
      const controlDigit = control.value.slice(-1)[0];
      const validationDigit = control.value.slice(0, -1);
      let sumEven = 0;
      let sumOdd = 0;

      for (let i = 1; i < 11; i += 2) {
        let tmpSum = validationDigit[i] * 2;
        if (tmpSum > 9) {
          tmpSum =
            parseInt(("" + tmpSum).slice(0, 1)) +
            parseInt(("" + tmpSum).slice(1));
        }
        sumEven += tmpSum;
      }

      for (let i = 0; i < 10; i += 2) {
        sumOdd += parseInt(validationDigit[i]);
      }
      const res = parseInt(("" + (sumOdd + sumEven)).slice(-1));
      let output: any;
      if (res === 0) {
        output = 0;
      } else {
        output = 10 - res;
      }
      if (parseInt(output) !== parseInt(controlDigit)) {
        return { lbl_invalid_characters: true };
      }
    }
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
