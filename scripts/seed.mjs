// Writes the fictional demo data in seed/ to Cloud Firestore through the REST API.
//
//   FIREBASE_PROJECT_ID=my-project FIRESTORE_TOKEN="$(gcloud auth print-access-token)" npm run seed
//
// Every document has a fixed id and is written with PATCH (create or replace), so running the
// script again resets the seeded documents instead of duplicating them. Reviews posted from the
// app have auto ids and are left alone. An OAuth token bypasses security rules, which is why the
// seeded reviews can carry historical createdAt values that clients could never write.

import { readFile } from 'node:fs/promises';

const FIRESTORE_API = 'https://firestore.googleapis.com/v1';
const PROFESSORS_COLLECTION = 'professors';
const REVIEWS_SUBCOLLECTION = 'reviews';
const PROFESSORS_FILE = new URL('../seed/professors.json', import.meta.url);
const REVIEWS_FILE = new URL('../seed/reviews.json', import.meta.url);

function readRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Set ${name} before running the seed. See the README's "Seed the database" section.`);
  }
  return value;
}

async function readJson(fileUrl) {
  return JSON.parse(await readFile(fileUrl, 'utf8'));
}

/** Converts a plain JSON value to the Firestore REST Value shape. */
function toFirestoreValue(value) {
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    // The REST API sends 64-bit integers as strings.
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
  throw new Error(`Unsupported seed value: ${JSON.stringify(value)}`);
}

function toFirestoreFields(record) {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, toFirestoreValue(value)]));
}

function professorFields({ id: _id, ...professor }) {
  return toFirestoreFields(professor);
}

function reviewFields({ id: _id, createdAt, ...review }) {
  const createdAtDate = new Date(createdAt);
  if (Number.isNaN(createdAtDate.getTime())) {
    throw new Error(`Review has an invalid createdAt: ${createdAt}`);
  }
  return { ...toFirestoreFields(review), createdAt: { timestampValue: createdAtDate.toISOString() } };
}

/** Catches seed mistakes the security rules would reject for a client, before anything is written. */
function assertReviewsMatchProfessors(professors, reviewsByProfessor) {
  const coursesByProfessor = new Map(professors.map((professor) => [professor.id, professor.courses]));
  for (const [professorId, reviews] of Object.entries(reviewsByProfessor)) {
    const courses = coursesByProfessor.get(professorId);
    if (!courses) throw new Error(`reviews.json has reviews for unknown professor "${professorId}".`);
    for (const review of reviews) {
      if (!courses.includes(review.course)) {
        throw new Error(`Review ${professorId}/${review.id} uses course "${review.course}", which is not one of theirs.`);
      }
    }
  }
}

function createDocumentWriter(projectId, token) {
  const documentsUrl = `${FIRESTORE_API}/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;

  return async function writeDocument(documentPath, fields) {
    const response = await fetch(`${documentsUrl}/${documentPath}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-goog-user-project': projectId,
      },
      body: JSON.stringify({ fields }),
    });
    if (!response.ok) {
      throw new Error(`Writing ${documentPath} failed with ${response.status}: ${await response.text()}`);
    }
  };
}

async function main() {
  const projectId = readRequiredEnv('FIREBASE_PROJECT_ID');
  const token = readRequiredEnv('FIRESTORE_TOKEN');
  const [professors, reviewsByProfessor] = await Promise.all([readJson(PROFESSORS_FILE), readJson(REVIEWS_FILE)]);
  assertReviewsMatchProfessors(professors, reviewsByProfessor);

  const writeDocument = createDocumentWriter(projectId, token);
  let reviewCount = 0;

  // Sequential writes keep the output readable and stay far below any write rate limit.
  for (const professor of professors) {
    await writeDocument(`${PROFESSORS_COLLECTION}/${professor.id}`, professorFields(professor));
    const reviews = reviewsByProfessor[professor.id] ?? [];
    for (const review of reviews) {
      await writeDocument(
        `${PROFESSORS_COLLECTION}/${professor.id}/${REVIEWS_SUBCOLLECTION}/${review.id}`,
        reviewFields(review),
      );
    }
    reviewCount += reviews.length;
    console.log(`Seeded ${professor.name} with ${reviews.length} reviews.`);
  }

  console.log(`Done: ${professors.length} professors and ${reviewCount} reviews in project ${projectId}.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
