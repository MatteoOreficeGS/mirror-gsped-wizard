import { AbstractControl } from "@angular/forms";

export function ValidateEmail(
    control: AbstractControl
): { [key: string]: any } | null {
    var validRegex =
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
    var validRegex =
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/i;

    if (!control.value.match(validRegex)) {
        return { phoneInvalid: true };
    }
    return null;
}
