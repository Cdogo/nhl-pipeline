
const { API_ENDPOINT } = process.env;
console.log(API_ENDPOINT)
async function fetchData() {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();
    return [
        {
            name:'John',
            age:16,
            email:'john@john.com'
        },
        {
            name:'John',
            age:13,
            email:'john@john.com'
        },
        {
            name:'John',
            age:12,
            email:'john@john.com'
        },
        {
            name:'John',
            age:14,
            email:'john@john.com'
        },
    ];
}

function processRawData(rawData) {
    return rawData.map((item) => ({
    name: item.name,
    age: item.age,
    email: item.email.toLowerCase(),
    }));
}

export async function getData(){
    const data = await fetchData();
    const processedData = processRawData(data)
    return processedData
}