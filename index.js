const express = require('express');
const bodyParser = require('body-parser');
const { Pungutan } = require('./models');

const app = express();
app.use(bodyParser.json()); 

// create
app.post('/api/pungutan', async (req, res) => {
  const { primaryKey, nilaiFOB, asuransi, freight, kurs, ...otherData } = req.body;

  // Validasi
  if (nilaiFOB === undefined || asuransi === undefined || freight === undefined || kurs === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const CIF = nilaiFOB + asuransi + freight;
  const CIFRp = CIF * kurs;

  try {
    let pungutan;

    if (primaryKey) {
      // Update data jika primaryKey ada
      pungutan = await Pungutan.findOne({ where: { primaryKey } });
      if (pungutan) {
        await pungutan.update({ nilaiFOB, asuransi, freight, CIF, CIFRp, ...otherData });
      } else {
        pungutan = await Pungutan.create({ primaryKey, nilaiFOB, asuransi, freight, CIF, CIFRp, ...otherData });
      }
    } else {
      // Tambah data baru
      pungutan = await Pungutan.create({ nilaiFOB, asuransi, freight, CIF, CIFRp, ...otherData });
    }

    res.json({ message: 'Data saved', data: pungutan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

//  get all
app.get('/api/pungutan', async (req, res) => {
  try {
    const pungutan = await Pungutan.findAll();
    res.json(pungutan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// get by primaryKey
app.get('/api/pungutan/:primaryKey', async (req, res) => {
  try {
    const pungutan = await Pungutan.findOne({ where: { primaryKey: req.params.primaryKey } });
    if (pungutan) {
      res.json(pungutan);
    } else {
      res.status(404).json({ error: 'Data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});


app.listen(5000, () => {
  console.log('Server running on port 5000');
});
