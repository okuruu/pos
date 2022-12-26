import { globalURL } from "./mainLink";

export async function activeUsers(){
    const fetchUsers    = await fetch( globalURL + 'Ngig', {
        method: 'GET',
        credentials: 'include'
    })
    return await fetchUsers.json()
}

export const userResponse = await activeUsers();