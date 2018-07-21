import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';

import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { MatSliderModule } from '@angular/material/slider';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {

    dish: Dish;
    dishIds: number[];
    prev: number;
    next: number;
    feedbackForm: FormGroup;
    formErrors = {
        'author': '',
        'rating' : '',
        'comment': ''
    };

    validationMessages = {
        'author': {
            'required': 'Name is required.',
            'minlength': 'First Name must be at least 2 characters long.',
            'maxlength': 'FirstName cannot be more than 25 characters long.'
        },
        'comment': {
            'required': 'Comment is required.'
        },
    };

    constructor(private dishservice: DishService,
        private route: ActivatedRoute,
        private location: Location,
        private fb: FormBuilder) {
        this.createForm();
    }

    ngOnInit() {
        this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
        this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(+params['id'])))
            .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    }

    createForm(): void {
        this.feedbackForm = this.fb.group({
            author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
            comment: ['', Validators.required],
            rating: [3],
        });
        this.feedbackForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

        this.onValueChanged(); // (re)set validation messages now
    }

    onValueChanged(data?: any) {
        if (!this.feedbackForm) { return; }
        const form = this.feedbackForm;
        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);
                if (control && control.dirty && !control.valid) {
                    const messages = this.validationMessages[field];
                    for (const key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    }

    setPrevNext(dishId: number) {
        const index = this.dishIds.indexOf(dishId);
        this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
        this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }

    goBack(): void {
        this.location.back();
    }

    onSubmit() {
        var today = new Date().toDateString();
        this.dish.comments.push(this.feedbackForm.value, { date: today });
        this.feedbackForm.reset({
            author: '',
            rating: 5,
            comment: ''
        });
    }


}
