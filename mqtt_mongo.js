// MQTT-välityspalvelimen määrittely
const mqtt = require('mqtt');
const broker = 'mqtt://automaatio.cloud.shiftr.io';
const user = 'automaatio';
const pw = 'Z0od2PZF65jbtcXu';

// muodostetaan yhteys MQTT-brokeriin
const mq = mqtt.connect(broker, {
  username: user,
  password: pw
});

// tilataan oikea topic
const topic = 'automaatio2/#';
mq.on('connect', () => {
  console.log('Connected.....');
  mq.subscribe(topic);
});

// MongoDB-yhteyden määritys
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://aku:aku@aku.1hgkou9.mongodb.net/?retryWrites=true&w=majority&appName=aku";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Yhdistetään MongoDB:hen ja määritetään kokoelma
const myDB = client.db("sensordata2");
const myColl = myDB.collection("sensordata2");

// MQTT-viestin vastaanotto ja tietokantaan tallennus
mq.on('message', async (topic, message) => {
  try {
    const obj = JSON.parse(message.toString('utf8'));

    // Tulostetaan data siistissä muodossa Herokun lokiin
    console.log(`\nAika: ${obj.Time}`);
    console.log(`T: ${obj.T} °C, H: ${obj.H} %, DP: ${obj.DP} °C`);
    console.log(`CO2: ${obj.CO2} ppm, pCount: ${obj.pCount}`);

    // Tallennetaan tietokantaan
    await myColl.insertOne(obj);
    console.log("An entry was inserted successfully");
  } catch (err) {
    console.error("Virhe viestin käsittelyssä:", err);
  }
});






