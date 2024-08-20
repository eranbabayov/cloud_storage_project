let a = ['D05595']
console.log(a.join('+'))
let c = Object
console.log(c)

const res = await fetch("https://rest.kegg.jp/ddi/D00951+D00244");
const data = await res.text();
console.log("Full Response:");

async function main() {
    try {
        const res = await fetch("https://rest.kegg.jp/ddi/D00951+D00244");
        const data = await res.text();
        console.log("Full Response:", data);
    }
}

main()