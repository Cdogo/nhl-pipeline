
import { getData } from './getData.js'



async function main() {
  const processedData = await getData();
  //await storeData(processedData);
  console.log('Data has been successfully stored in the database!');
}

main().catch((err) => {
  console.error(err);
});
