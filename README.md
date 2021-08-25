# PowerSQL
Pure depedency-less NodeJS Type-safe SQL query bulder
<hr>

## Installation
We don't have a package at npm registry yet, but you can install it from GitHub: `npm i https://github.com/isaqueks/powersql.git#release`  
(You can remove the `#release` if you want the pure TypeScript development version)  
<hr>

### Creating a query   
1. Import the PowerSQL module:
```js
const { PowerSQL, PowerSQLDefaults, PowerSQLTable, PowerSQLTableColumn } = require('powersql');
```
2. Create the query using `PowerSQL` and `PowerSQLDefaults`:

#### Creating a table:
```js
const myTable = new PowerSQLTable('myTable', [
    new PowerSQLTableColumn('id', 'INT', ['PRIMARY KEY']),
    new PowerSQLTableColumn('name', 'TEXT')
])

const sqlQuery = PowerSQL(
    PowerSQLDefaults.createTable(myTable)
)
// CREATE TABLE IF NOT EXISTS ...

```

### Selecting data from a table:
```js
const sqlQuery = PowerSQL(
    PowerSQLDefaults.select('*'),
    PowerSQLDefaults.from(myTable),
    PowerSQLDefaults.where(
        PowerSQLDefaults.equal(
            'name',
            PowerSQLDefaults.param(
                'The name I want to select',
                'TEXT'
            )
        )
    )
)
// SELECT * FROM myTable WHERE name = 'The name I want to select';
```

### Selecting data from a table (From object):
```js
const data = {
    name: 'John'
}

const sqlQuery = PowerSQL(
    PowerSQLDefaults.selectObject(myTable, data)
)

// SELECT * FROM myTable WHERE name = 'John';

```

### Work in progress: 
Full documentation will be provided later.
PowerSQL stills in development and should only be used for tiny and small queries.

### Note:
1. PowerSQL does escape quotes when using `PowerSQLDefaults.param`: `PowerSQLDefaults.param("my 'string'", 'TEXT')`  
2. PowerSQL only builds the SQL query, it doesn't do any database connection.   
3. Don't use PowerSQL for complex queries and serious projects. It sills in development and is going to be a lot improved, but it stills being tested and fixed.
4. Feel free to open an Issue or a Pull request! PowerSQL is totally open-source, we are waiting your contribution!