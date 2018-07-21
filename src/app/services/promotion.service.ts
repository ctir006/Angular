import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
    getPromotions(): Observable<Promotion[]> {
        return of(PROMOTIONS).pipe();
    }

    getPromotion(id: number): Observable<Promotion> {
        return of(PROMOTIONS.filter((promo) => (promo.id === id))[0]).pipe();
    }

    getFeaturedPromotion(): Observable<Promotion> {
        return of(PROMOTIONS.filter((promotion) => promotion.featured)[0]).pipe();
    }

  constructor() { }
}
