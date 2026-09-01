const doc = {
  photos: [
    '{"id":"67c00e12001dc2f37c35","category":"Profile"}',
    '{"id":"67c00e13001dc2f37c36","category":"Interior"}'
  ]
};

const items = typeof doc.photos === 'string' ? JSON.parse(doc.photos) : doc.photos;
const profileItem = Array.isArray(items) ? items.find((p) => p.category === 'Profile') : null;
console.log("profileItem:", profileItem);
