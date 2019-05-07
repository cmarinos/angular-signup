

export class User {
    id: number;
    email: string;
    password: string;
    tier: number;
}

export class UserProfile {
    id: number;
    userId: number;
    firstname: string;
    lastname: string;
    imagePath: string;
    company: string;
    phone: string;
    mobilePhone: string;
    newsletter: boolean;
    addressOne: string;
    addressTwo: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
}
