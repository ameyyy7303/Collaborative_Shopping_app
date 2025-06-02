const EventEmitter = require('events'); // bring in the Events class

const party = new EventEmitter(); // our own event emitter (like a mic)

party.on('food-served', (dish) => {
  console.log(`Guest 1: Wow! ${dish} is here!`);
});

party.on('food-served', () => {
  console.log('Guest 2: Grabs a plate 🍽️');
});

party.emit('food-served', 'Paneer Tikka'); // emit the event
