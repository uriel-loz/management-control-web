export interface Login {
    code:    number;
    status:  string;
    message: string;
    data:    Data;
}

export interface Data {
    user: User;
}

export interface User {
    id:                number;
    name:              string;
    email:             string;
    phone:             string;
    email_verified_at: Date;
    created_at:        Date;
    updated_at:        Date;
    deleted_at:        null;
}
