import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { resolve } from 'q';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    genders = ['male', 'female'];
    signupForm: FormGroup;
    forbiddenUsernames = ['Chris', 'Anna'];

    ngOnInit() {
        this.signupForm = new FormGroup({
            'userData': new FormGroup({
                // BINDING IS NEEDED AS THIS WAS USED INSIDE THE CREATED VALIDATOR
                // DO NOT EXECUTE VALIDATORS, ONLY PASS THE REFERENCE TO THE METHOD
                'username': new FormControl('Panda', [Validators.required, this.forbiddenNames.bind(this)]),
                'email': new FormControl('Bear ', [Validators.required, Validators.email], this.forbiddenEmails),
            }),
              'gender': new FormControl('male', Validators.required),
              'hobbies': new FormArray([])
        });

        // OCHEN KRUTA OBSERVABLES
        // this.signupForm.valueChanges.subscribe(
        //     (value) => console.log(value)
        // );

        // this.signupForm.statusChanges.subscribe(
        //     (value) => console.log(value)
        // );

        // this.signupForm.setValue({
        //     'userData': {
        //         'username': 'Max',
        //         'email': 'max@test.de'
        //     },
        //     'gender': 'male',
        //     'hobbies': []
        // })

        this.signupForm.patchValue({
            'userData': {
                'username': 'Max',
            }
        })
    }

    onSubmit() {
        console.log(this.signupForm);
        this.signupForm.reset();
    }

    // SENDS HOBBY TO FORM
    onAddHobby() {
        const control = new FormControl(null, Validators.required);
        (<FormArray>this.signupForm.get('hobbies')).push(control);
    }

    // VALIDATOR FOR NAMES (THESE CAN BE PUT IN ANOTHER FILE-PREFIX METHOD WITH 'STATIC')
    forbiddenNames(control: FormControl): {[s: string]: boolean} {
        // THIS INDEXOF IS TO CHECK AGAINST NAMES IN THE ARRAY
        if (this.forbiddenUsernames.indexOf(control.value) !== -1) {
            return {'nameIsForbidden': true};
        } else {
            return null;
        }
    }

    // ASYNC VALIDATOR MUST BE A THIRD ARGUMENT IN THE FORMCONTROL
    forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
        const promise = new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                if (control.value === 'test@test.com') {
                    resolve({'emailIsForbidden': true});
                } else {
                    resolve(null);
                }
            }, 1500);
        });
        return promise
    }
}
