// MQTT-välityspalvelimen määrittely
const mqtt = require('mqtt');
const broker = 'mqtt://automaatio.cloud.shiftr.io';
const user = 'automaatio';
const pw = 'Z0od2PZF65jbtcXu';

// Muodostetaan yhteys MQTT-brokeriin
const mq = mqtt.connect(broker, {
  username: user,
  password: pw
});

// Tallennuksen ohjausmuuttuja
let saveEnabled = true; // Oletuksena päällä

// Tilataan aiheet
const dataTopic = 'automaatio2/#';
const toggleTopic = 'automaatio2/saveToggle';

mq.on('connect', () => {
  console.log('Connected to MQTT broker');
  mq.subscribe(dataTopic);
  mq.subscribe(toggleTopic);
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

// MQTT-viestien käsittely
mq.on('message', async (topic, message) => {
  const msg = message.toString('utf8');

  // Tallennuksen ohjausviesti
  if (topic === toggleTopic) {
    saveEnabled = (msg === 'on');
    console.log(`\n➡️ Tallennus ${saveEnabled ? 'PÄÄLLÄ' : 'POIS PÄÄLTÄ'}`);
    return;
  }

  // Sensoridatan tallennus
  if (saveEnabled) {
    try {
      const obj = JSON.parse(msg);

      console.log(`\nAika: ${obj.Time}`);
      console.log(`T: ${obj.T} °C, H: ${obj.H} %, DP: ${obj.DP} °C`);
      console.log(`CO2: ${obj.CO2} ppm, pCount: ${obj.pCount}`);

      await myColl.insertOne(obj);
      console.log("✅ Data tallennettu tietokantaan");
    } catch (err) {
      console.error("❌ Virhe viestin käsittelyssä:", err);
    }
  } else {
    console.log("⛔ Data vastaanotettu, mutta tallennus on pois päältä");
  }
});






