import { Injectable, InjectionToken } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppInternalSettings {

    public settings =  {
        ANONYMOUS_POOL_ID: 'us-east-1:72e65e24-58b0-4d99-baa5-e35acdeb6d78',
        REGION: 'us-east-1',
        VIDEO_SUBMISSION_BUCKET: 'djafricashow-submissions',
        COUNTRIES: [
            'Algeria',
            'Angola',
            'Benin',
            'Botswana',
            'British Indian Ocean Territory',
            'Burkina Faso',
            'Burundi',
            'Cameroon',
            'Cape Verde',
            'Central African Republic',
            'Chad',
            'Comoros',
            'Congo',
            'Djibouti',
            'Egypt',
            'Equatorial Guinea',
            'Eritrea',
            'Ethiopia',
            'Gabon',
            'Gambia',
            'Ghana',
            'Guinea',
            'Guinea-Bissau',
            'Ivory Coast',
            'Kenya',
            'Lesotho',
            'Liberia',
            'Libya',
            'Madagascar',
            'Malawi',
            'Mali',
            'Mauritania',
            'Mauritius',
            'Mayotte',
            'Morocco',
            'Mozambique',
            'Namibia',
            'Niger',
            'Nigeria',
            'Other',
            'Reunion',
            'Rwanda',
            'Saint Helena',
            'Sao Tome and Principe',
            'Senegal',
            'Seychelles',
            'Sierra Leone',
            'Somalia',
            'South Africa',
            'South Sudan',
            'Sudan',
            'Swaziland',
            'Tanzania',
            'The Democratic Republic of Congo',
            'Togo',
            'Tunisia',
            'Uganda',
            'Western Sahara',
            'Zambia',
            'Zimbabwe'
        ],
        CONTACT_METHODS: [
            'Email',
            'Phone',
            'WhatsApp',
            'Other'
        ],
        LANGUAGES: [
            'English',
            'French',
            'Portuguese',
            'Other'
        ]
    }
    constructor( ){

    }
}
