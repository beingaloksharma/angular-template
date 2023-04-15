//Book 
export interface Book {
    id: number
    tenant_id: number
    name: string
    category: string
    edition: string
    author_name: string
    isbn_no: string
    languages: string[]
    keywords: string[]
    publication: string
    reading_age: string
    publication_date: string
    country_of_origin: string
    paperback: number
    status: string
    created_at?: string
    created_by?: string
    updated_at?: string
    updated_by?: string
}

//Update Status 
export interface UpdateStatus {
    id: number
    status: string
    updated_by: string
}

//Languages
export interface Languages {
    language: string
}

//Keywords
export interface Keywords {
    keyword: string
}

//User Sign Up
export interface Singup {
    name: string
    email: string
    moblie: string
    user_name: string
    password: string
    confirm_password: string
    terms_and_conditions: boolean
    created_by: string
}

//Login
export interface Login {
    user_name: string
    password: string
}

//Forgot Password 
export interface ForgotPassword {
    user_name: string
    password: string
    confirm_password: string
}