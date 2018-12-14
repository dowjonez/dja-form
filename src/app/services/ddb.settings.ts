import { Injectable, InjectionToken } from '@angular/core';

export interface DdbQueryDef {
  fe: string;
  feVals: object;
  feAliases?: object;
}


@Injectable({
    providedIn: 'root'
})
export class DdbInternalSettings {
  public settings = {
    DATASET_LIMIT: 50,
    QUERIES: {
      age_value: {
        fe: 'candidate_age = :age',
        feVals: { ':age': null } // integer, required
      },
      age_range:  {
        fe: 'candidate_age between :start_age and :end_age',
        feVals: {
          ':start_age': null, // integer, required
          ':end_age': null // integer, required
        }
      },
      travel_restrictions: {
        fe: 'travel_restriction.travel_restriction = :val',
        feVals: { ':val': null } // boolean, required
      },
      spoken_language: {
        fe: '#sl.#prim.#lang = :lang or #sl.#sec.#lang = :lang',
        feVals: { ':lang': null }, // string, required
        feAliases: {'#sl':  'spoken_languages', '#sec':  'secondary' , '#prim': 'primary', '#lang': 'language'}
      },
      country: {
        fe: 'country.country = :cntry',
        feVals: { ':cntry': null } // string, required
      },
      gender: {
        fe: 'gender = :gen',
        feVals: { ':gen': null } // string, required
      },
      valid_passport: {
        fe: 'valid_passport = :val',
        feVals: { ':val': null } // boolean, required
      },
      submission_date: {
        fe: 'valid_passport = :date',
        feVals: { ':submission_date': null } // string, whatever the aws.engine dateString() returns when passed a date, required
      },
      status_and_language: {
        fe: '(#sl.#prim.#lang = :lang or #sl.#sec.#lang = :lang) and  #st1.#st2 = :stat',
        feVals: {
          ':lang': null, // string, required
          ':stat': null // string, required
        },
        feAliases: {'#sl':  'spoken_languages', '#sec':  'secondary' , '#prim': 'primary', '#lang': 'language'}
      }
    },
    QUERY_NAMES: [
      'age_value', 'age_range', 'travel_restrictions', 'spoken_language',
      'country', 'gender', 'valid_passport', 'submission_date', 'submission_date'
    ]
  };

}
