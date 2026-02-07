export interface Login {
    code:    number;
    status:  string;
    message: string;
    data:    Data;
}

export interface Data {
    user:  User;
}

export interface User {
    id:                string;
    name:              string;
    email:             string;
    phone:             string;
    created_at:        Date;
    updated_at:        Date;
}
