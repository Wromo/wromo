export async function get() {
    return {
        body: JSON.stringify({
            name: 'Wromo Technology Company',
            url: 'https://wromo.build/'
        })
    }
}
