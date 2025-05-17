import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { encryptPassword } from './encryption';

const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }

  for (const modelName of modelNames) {
    const sequenceName = `"${modelName}_id_seq"`;
    try {
      await prisma.$executeRawUnsafe(`ALTER SEQUENCE ${sequenceName} RESTART WITH 1`);
      console.log(`Sequence for ${modelName} reset`);
    } catch (error) {
      console.error(`Error resetting sequence for ${modelName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, 'seed');

  const orderedFileNames = [
    'user.json',
    'conversation.json',
    'message.json'
  ];

  await deleteAllData([...orderedFileNames].reverse());

  for (const fileName of orderedFileNames) {
    if (fileName === 'cartItem.json' || fileName === 'cart.json') {
      continue;
    }
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      for (const data of jsonData) {
        if (modelName === 'user') {
          data.password = await encryptPassword(data.password);
        }
        if (modelName === 'productAvailability' && data.specificDate) {
          data.specificDate = new Date(data.specificDate);
        }
        if (modelName === 'transaction') {
          data.orderDate = new Date(data.orderDate);
        }
        if (modelName === 'order') {
          data.starting = new Date(data.starting);
          data.ending = new Date(data.ending);
          if (data.orderId) {
            data.transactionId = data.orderId;
            delete data.orderId;
          }
        }
        await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
