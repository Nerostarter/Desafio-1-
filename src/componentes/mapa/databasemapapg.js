const {Client} =  require('pg')


const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
});

client.connect();

client.query(`Select * from pontos_servicos`, (err,res)=>{
    if(!err){
        console.log(res.rows);
    }else{
        console.log(res.rows);
    }
    client.end;
})