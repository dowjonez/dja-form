export interface Language {
    language: string;
    specify?: string; // becomes required if language === "Other"
}
  ​

export interface Language {
    language: string;
    specify?: string; // becomes required if language === "Other"
}

export interface Languages {
    primary: Language;
    secondary?: Language;
}

export interface TravelRestriction {
    travel_restriction: boolean;
    restriction_reason?: string; // becomes required if travel_restriction true
}

export interface Country {
    country: string;
    other_country?: string; // becomes required if country === "Other"
}

export interface ContactMethod {
    method: string;
    other_method?: string; // becomes required if type === "Other"
}

export interface ContactPoint {
    type: ContactMethod;
    value: string;
}

export interface ContactPoints {
    primary: ContactPoint;
    secondary?: ContactPoint;
}

export interface SubmissionEntry {
    id: string; // guid generated by the system, not visible, should be null until submitted
    create_time: Date; // not visible Date.now()
    last_name: string;
    first_name: string;
    full_name: string; // first_name + ' ' + last_name
    country: Country;
    gender: string;
    spoken_languages: Languages;
    dob: Date;
    valid_passport: boolean; // would rephrase the question: Do you own a valid passport issued by your country?
    travel_restriction: TravelRestriction;
    contact_points: ContactPoints;
    status: EntryStatus;
    status_history?: EntryStatusTrail; // this is just the management history for a superuser
}

export enum EntryStatusType {
  New,
  PreRejected, // first pass rejected
  PreApproved, // first pass approved
  Selected, // finalist
  Rejected, // rejected on subsequent passes
  Standby // not a finalist, but not rejected either, on standby in case a finalist will not make it for whateever reason
}

export interface EntryStatus {
  id: string; // DynamoDb key
  status: EntryStatusType; // required
  team?: VotingTeam; // null when 'New' becomes required otherwise
  last_status_date: string;
}

export interface EntryStatusTrail {
  submission_id: string; // DynamoDb key, not auto-generated, enables joins
  history: Array<EntryStatus>; // to record managment activity trail
}

export interface ManagedUser {  // this might need changes depending on the provider
  id: string; // generated by the provider
  email: string; // the user name
  name: string; // for display purposes
}

export interface VotingTeam {
  id: string; // the key for DynamoDb
  name: string; // for display purposes
  users: Array<ManagedUser>;
}
