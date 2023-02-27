export type relevantUserFields = {
    last_name: string,
    first_name: string,
    country: string,
    postcode: string,
    email: string,
    phone: string,
    cell: string,
    picture: string
} | null

export const getUser = async () => fetch('https://randomuser.me/api/')
    .then(response => response.json())
    .then(json => json.results[0])
    .then(result => ({
        last_name: result.name.last,
        first_name: result.name.first,
        country: result.location.country,
        postcode: result.location.postcode,
        email: result.email,
        phone: result.phone,
        cell: result.cell,
        picture: result.picture.large
    }))