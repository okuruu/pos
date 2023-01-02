import { globalURL } from "./mainLink";

export async function activeUsers(){

    try {
        
        const fetchUsers    = await fetch( globalURL + 'Ngig', {
            method: 'GET',
            credentials: 'include'
        })
        return await fetchUsers.json()

    } catch (error) {
        console.log(error.message)
    }


}

export const userResponse = await activeUsers();