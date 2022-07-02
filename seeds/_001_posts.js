const { faker } = require('@faker-js/faker');

function generate(ok) {
  var data = []
  if (!ok) return data;

  const limitRecords = 1;

  for (let id = 1; id <= limitRecords; id++) {
    let currentTime = Date.now();

    data.push({
      "id": id,
      "title": faker.lorem.lines(),
      "image": {
        "rectangle": faker.image.nature(640, 480),
        "square": faker.image.nature(350, 350),
      },
      "description": faker.lorem.sentences(2),
      "content": faker.lorem.paragraphs(50),
      "keywords": faker.random.words(5).split(" ").map(word => { return word.toLowerCase() }),
      "color": faker.color.human(),
      "author": {
        "id": id,
        "name": faker.name.findName(),
        "avatar": faker.image.avatar(),
        "bio": faker.lorem.sentence(),
        "address": faker.address.streetAddress(),
        "email": faker.internet.email(),
      },
      "created_at": currentTime,
      "updated_at": currentTime,
    })
  }
  return data;
}

module.exports = { "posts": generate }
