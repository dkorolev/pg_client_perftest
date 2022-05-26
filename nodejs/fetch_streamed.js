const { Client, Pool } = require('pg');
const QueryStream = require('pg-query-stream');

if (!process.env.PGTABLE) {
  console.error('Please set env `PGTABLE` too.');
  process.exit(1);
}

const pg = new Client();
pg.connect((err, conn) => {
  if (err) {
    console.error('DB unavailable.');
  } else {
    const sql_stream = conn.query(new QueryStream(`select * from ${process.env.PGTABLE};`));
    let c = 0;
    sql_stream.on('data', row => {
      ++c;
    });
    sql_stream.on('end', (err, res) => {
      if (err) {
        console.error('SQL failed.');
      } else {
        console.log(`OK, ${c} records.`);
        conn.end();
      }
    });
  }
});
