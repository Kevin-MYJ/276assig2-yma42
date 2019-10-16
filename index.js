const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;
var app = express();

const {Pool} = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
app.get('/db', async (req, res) => {
  try {
    const client = await pool.connect()
    const result = await client.query(`selecte * from tokimon`);
    const results = { 'results': (result) ? result.rows : null};
    res.render('pages/db', results );
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/home1'));
app.post('/home', (req, res) => res.redirect('/'));

app.post('/tokimon', (req,res) => {
    var getUserQuery = `select * from tokimon order by name ASC;`;
    //console.log(getUserQuery);
    pool.query(getUserQuery, (error, result) => {
      if(error)
        res.end(error);
      var results = {'rows': result.rows};
      //console.log(results);
      res.render('pages/tokimon', results);
    });
});

app.post('/add',async (req,res) => {
  var Na = req.body.newTokimon;
  var Tr = req.body.newTrainer;
  var We = Number(req.body.weight);
  var He = Number(req.body.height);
  var Fl = Number(req.body.fly);
  var Fi = Number(req.body.fight);
  var Fir = Number(req.body.fire);
  var Wa = Number(req.body.water);
  var El = Number(req.body.electric);
  var Fr = Number(req.body.frozen);
  var total = Fl + Fi + Fir + Wa + El + Fr;

  var judgement = 'news';
  if(Na == ''||Tr==''){
    judgement = 'empty';
    //console.log(judgement);
  }
  else{
    var client = await pool.connect();
    var check = await client.query(`SELECT * FROM tokimon ORDER BY name ASC`);
    var checking = (check) ? check.rows : null;
    //console.log(checking);
    checking.forEach(function(t){
      if(t.name == Na){
        judgement = 'exist';
        //console.log(judgement);
      }
    });
    client.release();
  }
  if(judgement == 'news'){
    var insert = `INSERT INTO tokimon(name, weight, height, fly, fight, fire, water, electric, frozen, total, trainer) VALUES ('${Na}', ${We},${He},${Fl},${Fi},${Fir},${Wa},${El},${Fr},${total},'${Tr}')`;
    //console.log(insert);
    pool.query(insert, (error,result) => {
      if(error)
      res.end(error);
      //console.log(result);
    });
  };

  var determin = {'determin': judgement};
  //console.log(determin);
  res.render('pages/add', determin);
});

app.get('/tokimon/:name/details', (req,res) => {
  console.log(req.params.name);
  var getUsersQuery = "SELECT * FROM tokimon WHERE name = '"+ req.params.name +"'";
  console.log(getUsersQuery);
  pool.query(getUsersQuery, (error, result) => {
    if (error)
      res.end(error);
    var results = {'rows': result.rows };
    console.log(results);
    res.render('pages/details', results)
  });
});

app.post('/tokimon/:name/details/delete', (req,res) => {
  var getUserQuery = "DELETE FROM tokimon WHERE name = '"+ req.params.name +"'";
  //console.log(getUserQuery);
  pool.query(getUserQuery, (error, result) => {
    if(error)
      res.end(error);
    res.render('pages/delete', {'deletename': req.params.name});
  });
});

app.post('/tokimon/:name/details/edit', (req,res) => {
  //console.log(req.body.name);
  var getUsersQuery = "SELECT * FROM tokimon WHERE name = '"+ req.params.name +"'";
  //console.log(getUsersQuery);
  pool.query(getUsersQuery, (error, result) => {
    if (error)
      res.end(error);
    var results = {'rows': result.rows };
    //console.log(results);
    res.render('pages/edit', results)
  });
});

app.post('/tokimon/:name/details/edit/update', async(req,res) => {
  var Na = req.params.name;
  var Tr = req.body.newTr;
  var We = Number(req.body.newWe);
  var He = Number(req.body.newHe);
  var Fl = Number(req.body.newFl);
  var Fi = Number(req.body.newFi);
  var Fir = Number(req.body.newFir);
  var Wa = Number(req.body.newWa);
  var El = Number(req.body.newEl);
  var Fr = Number(req.body.newFr);
  var total = Fl + Fi + Fir + Wa + El + Fr;

  var client = await pool.connect();
  var update = await client.query(`UPDATE tokimon SET name = '${Na}' WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET weight = ${We} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET height = ${He} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET fly = ${Fl} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET fight = ${Fi} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET fire = ${Fir} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET water = ${Wa} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET electric = ${El} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET frozen = ${Fr} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET total = ${total} WHERE name = '${Na}';`);
  update = await client.query(`UPDATE tokimon SET trainer = '${Tr}' WHERE name = '${Na}';`);
  console.log(`SELECT FROM tokimon WHERE name = '${Na}';`);
  res.redirect('/tokimon/'+Na+'/details');
  client.release();
});

app.post('/trainer', (req,res) => {
  res.render('pages/trainer')
});

app.post('/trainer/addTokimon', async(req,res) => {
  var Tr = req.body.Train;
  var client = await pool.connect();
  var getUserQuery = await client.query(`SELECT * FROM tokimon WHERE trainer = '${Tr}' ORDER BY name ASC;`);
  var trainers = {'rows': getUserQuery.rows};
  res.render('pages/addTokimon', trainers);
  client.release();
});

app.post('/tokimon/compare', async(req,res) => {
  var client = await pool.connect();
  var getUserQuery = await client.query(`SELECT name FROM tokimon`);
  var names = {'names': getUserQuery.rows};
  res.render('pages/compare', names);
  client.release();
});

app.post('/tokimon/compare/result', async(req,res) => {
  var client = await pool.connect();
  var attr = req.body.attribute;
  var com1 = req.body.compare1;
  var com2 = req.body.compare2;
  console.log(attr);
  console.log(com1);
  console.log(com2);
  var res1 = await client.query(`SELECT ${attr} FROM tokimon WHERE name = '${com1}'`);
  var res2 = await client.query(`SELECT ${attr} FROM tokimon WHERE name = '${com2}'`);
  var data = {};
  //console.log(res1.rows);
  data.comp1 = res1.rows;
  data.comp2 = res2.rows;
  data.nam1 = com1;
  data.nam2 = com2;
  data.att = attr;
  console.log(data.comp1);
  console.log(data.comp2);
  var datas = {'data': (data)};
  res.render('pages/result', datas);
  client.release();
});

app.post('/tokimon/display', async(req,res) => {
  var client = await pool.connect();
  var display = await client.query(`SELECT * FROM tokimon;`);
  var displays = {'rows':display.rows};
  // console.log(displays);
  res.render('pages/display', displays);
  client.release();
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
