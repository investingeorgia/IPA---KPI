import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from './firebaseConfig';
import {
  getMockUsers,
  getMockKPIs,
  getMockTodos,
  getMockProgressLogs,
  getMockCompanies,
  getMockArticles,
} from '../data/mockData';

async function seedCollection(collectionName, items) {
  console.log(`Seeding ${collectionName}...`);
  for (const item of items) {
    await setDoc(doc(db, collectionName, item.id), item);
  }
  console.log(`  Done: ${items.length} documents written to ${collectionName}.`);
}

export async function seed() {
  // Guard: skip if kpis collection is already non-empty
  const kpisSnapshot = await getDocs(collection(db, 'kpis'));
  if (!kpisSnapshot.empty) {
    console.log('Firestore already seeded — kpis collection is non-empty. Skipping.');
    return;
  }

  console.log('Starting Firestore seed...');

  const users = getMockUsers();
  await seedCollection(
    'users',
    users.map(({ id, name, email, role, initials, color, language, active }) => ({
      id,
      name,
      email,
      role,
      initials,
      color,
      language,
      active,
    }))
  );

  await seedCollection('kpis', getMockKPIs());
  await seedCollection('todos', getMockTodos());
  await seedCollection('progress_logs', getMockProgressLogs());
  await seedCollection('companies', getMockCompanies());
  await seedCollection('articles', getMockArticles());

  console.log('Firestore seed complete.');
}
