//Book 
export interface Book {
    id: number
    tenant_id: number
    name: string
    category: string
    edition: string
    author_name: string
    isbn_no: string
    language: string[]
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