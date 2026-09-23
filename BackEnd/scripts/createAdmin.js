// BackEnd/scripts/debugFileMapping.js
require('dotenv').config();
const mongoose = require('mongoose');
const File = require('../models/File');
const {
  DESC_TO_KEY,
  KEY_TO_DESC,
  getSectionForFile,
} = require('../config/sectionMap');
const { ALL_DOCUMENTS } = require("../config/documentSections");

(async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/startupsteroid';
  await mongoose.connect(uri);
  console.log('DB:', mongoose.connection.db.databaseName);
  console.log('');

  // 1. List every mapped description
  console.log('=== MAP KEYS (frontend document names) ===');
  console.log('Total mapped:', Object.keys(DESC_TO_KEY).length);
  ALL_DOCUMENTS.forEach((desc, i) => {
    const key = DESC_TO_KEY[desc];
    console.log(`${String(i + 1).padStart(2)}. ${key.padEnd(40)} ← "${desc}"`);
  });

  // 2. List every uploaded file's description
  console.log('\n=== FILES IN DATABASE ===');
  const files = await File.find({ isDeleted: false }).sort('-createdAt');
  console.log('Total files:', files.length);
  console.log('');

  const unmatched = [];
  files.forEach((f, i) => {
    const key = getSectionForFile(f);
    const status = key ? `✅ ${key}` : '❌ UNMATCHED';
    console.log(
      `${String(i + 1).padStart(2)}. ${status.padEnd(45)} | "${f.description}"`
    );
    if (!key) unmatched.push(f.description);
  });

  // 3. Summary
  console.log('\n=== SUMMARY ===');
  const uniqueDescriptions = [...new Set(files.map((f) => f.description))];
  console.log('Unique descriptions in DB:', uniqueDescriptions.length);
  uniqueDescriptions.forEach((d) => console.log(`  • "${d}"`));

  if (unmatched.length > 0) {
    console.log('\n⚠️  UNMATCHED descriptions (need to add to documentSections.js):');
    [...new Set(unmatched)].forEach((d) => console.log(`  ❌ "${d}"`));
  } else {
    console.log('\n✅ All descriptions matched');
  }

  process.exit(0);
})();