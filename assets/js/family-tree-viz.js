// 2D canvas family tree: highlights each person as pre-order, post-order, or search visits them.

// Same sample family as main.py
const family = {
  name: 'Rosa', children: [
    { name: 'Ana', children: [
      { name: 'Mia', children: [{ name: 'Leo', children: [] }] },
      { name: 'Sam', children: [] },
    ] },
    { name: 'Luis', children: [{ name: 'Eva', children: [] }] },
    { name: 'Clara', children: [] },
  ],
};

const canvas = document.getElementById('family-canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('family-status');

// Layout: y by generation, x by the order leaves appear left to right
let nextLeafX = 0;
function layout(person, depth) {
  person.y = 40 + depth * 80;
  if (person.children.length === 0) {
    person.x = 50 + nextLeafX * 80;
    nextLeafX++;
  } else {
    person.children.forEach((child) => layout(child, depth + 1));
    person.x = (person.children[0].x + person.children[person.children.length - 1].x) / 2;
  }
}
layout(family, 0);

// color for each person by name; anyone missing is drawn as unvisited
let colors = {};

function draw(person) {
  for (const child of person.children) {
    ctx.strokeStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(person.x, person.y);
    ctx.lineTo(child.x, child.y);
    ctx.stroke();
    draw(child);
  }
  ctx.fillStyle = colors[person.name] || '#ddd';
  ctx.beginPath();
  ctx.arc(person.x, person.y, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(person.name, person.x, person.y);
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw(family);
}

// Traversals, same logic as the Python methods
function preorder(person, out = []) {
  out.push(person);
  person.children.forEach((child) => preorder(child, out));
  return out;
}

function postorder(person, out = []) {
  person.children.forEach((child) => postorder(child, out));
  out.push(person);
  return out;
}

function findPerson(person, name, visited) {
  visited.push(person);
  if (person.name === name) return person;
  for (const child of person.children) {
    const found = findPerson(child, name, visited);
    if (found) return found;
  }
  return null;
}

// Step through a list of people, one every 600ms
let timer = null;
function play(label, order, done) {
  clearInterval(timer);
  colors = {};
  let i = 0;
  timer = setInterval(() => {
    if (i > 0) colors[order[i - 1].name] = '#9ec5fe';  // visited
    if (i === order.length) {
      clearInterval(timer);
      redraw();
      if (done) done();
      return;
    }
    colors[order[i].name] = '#ffd43b';                  // visiting now
    statusText.textContent = label + order.slice(0, i + 1).map((p) => p.name).join(' → ');
    redraw();
    i++;
  }, 600);
}

function search(name) {
  const visited = [];
  const found = findPerson(family, name, visited);
  play(`find_person("${name}"): `, visited, () => {
    if (found) {
      colors[name] = '#8ce99a';
      statusText.textContent += `  ✓ found ${name}`;
    } else {
      statusText.textContent += `  ✗ ${name} not in tree, returns None`;
    }
    redraw();
  });
}

document.getElementById('btn-preorder').onclick = () => play('Pre-order: ', preorder(family));
document.getElementById('btn-postorder').onclick = () => play('Post-order: ', postorder(family));
document.getElementById('btn-find-leo').onclick = () => search('Leo');
document.getElementById('btn-find-zed').onclick = () => search('Zed');

redraw();
