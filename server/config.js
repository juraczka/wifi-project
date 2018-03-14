var config = {};
config.db = {};

config.db.type = 'mysql';
config.db.charset = 'utf8';

config.db.username = 'root';
config.db.password = 'mnif4674';
config.db.host = '82.165.22.224';
config.db.dbname = 'wifi'; // DB name

config.db.users_tbl = 'users'; // table name
// config.db.another_tbl = 'next_table'; // ...

// export
module.exports = config;
