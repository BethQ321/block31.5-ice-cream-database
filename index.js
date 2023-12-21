const pg = require('pg')
const client = new pg.Client('postgres://localhost/icecream_db')

const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const port = process.env.PORT || 3002
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })

//GET all ice cream
app.get('/api/icecream', async(req, res, next) => {
    try {
        console.log("api/icecream")
        const SQL = `
            SELECT * FROM icecream;
        `
        const {rows} = await client.query(SQL)
        console.log(rows)
        res.send(rows)
    } catch (error) {
        next(error)
    }
})

//GET one ice cream
app.get('/api/icecream/:id', async (req, res, next) => {
    try {
        console.log(req.params.id)

        const SQL = `
            SELECT * FROM icecream WHERE id=$1;
        `
        const response = await client.query(SQL, [req.params.id])

        if(!response.rows.length) {
            next({
                name: "id error",
                message: `ice cream with ${req.params.id} not found`
            })
        } else {
            res.send(response.rows[0])
        }
        
    } catch (error) {
        next(error)
    }
})

//DELETE a food
app.delete('/api/icecream/:id', async (req, res, next) => {
    try {
        console.log("delete rows")
        const SQL = `
            DELETE FROM icecream WHERE id=$1;
        `
        const response = await client.query(SQL, [req.params.id])
        console.log("delete response", response)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

//Error handlers
app.use((error, req, res, next) => {
    res.status(500)
    res.send(error)
})

app.use('*', (req, res, next) => {
    res.send("No such route exists")
})

const init = async() => {
    await client.connect()
    console.log("connected to database")

    const SQL = `
        DROP TABLE IF EXISTS icecream;
        CREATE TABLE icecream(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50)
        );
        INSERT INTO icecream (name) VALUES ('vanilla');
        INSERT INTO icecream (name) VALUES ('chocolate');
        INSERT INTO icecream (name) VALUES ('strawberry');
        INSERT INTO icecream (name) VALUES ('chocolate chip');
        INSERT INTO icecream (name) VALUES ('apple pie');
        INSERT INTO icecream (name) VALUES ('key lime');
        INSERT INTO icecream (name) VALUES ('pumpkin');
        INSERT INTO icecream (name) VALUES ('red velvet');
        INSERT INTO icecream (name) VALUES ('blueberry crumble');        
    `
    await client.query(SQL)
    console.log("table created & seeded")

    }

init()