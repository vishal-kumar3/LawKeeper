import fs from 'fs';
import csv from 'csv-parser';
import prisma from '@/prisma';


async function seedPoliceStations() {
  const results: any[] = [];

  fs.createReadStream('/home/vishal/Downloads/Police_Station_0_0.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const station of results) {
        // convert to lower case
        station.state = station.state.toLowerCase();
        station.city = station.city.toLowerCase();
        station.district = station.district.toLowerCase();
        station.address = station.address.toLowerCase();
        station.stationName = station.stationName.toLowerCase();
        station.stationPhone = station.stationPhone.replace(/\D/g, '');
        if (station.stationPhone.startsWith('0')) {
          station.stationPhone = station.stationPhone.slice(1);
        }

        const addressWithStation = await prisma.address.create({
          data: {
            zone: "East",
            state: station.state,
            city: station.city,
            district: station.district,
            postalCode: station.postalCode,
            address: station.address,
            policeStation: {
              create: {
                stationName: station.stationName,
                stationPhone: station.stationPhone,
              },
          },
        }});
        console.log(addressWithStation);
      }

      console.log('Police stations seeded successfully!');
    });
}

seedPoliceStations().catch((e) => {
  console.error(e);
});
