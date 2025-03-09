import { DATABASE_URL } from '../config.js'
import pkg from 'pg'
const { Pool } = pkg

export const createDBPool = async () => {
  try {
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: { sslmode: 'require', rejectUnauthorized: false },
    })
    console.log(`createDBPool пул создан`)
    return pool
  } catch (e) {
    console.log(`error createDBPool ${e}`)
  }
}

export const makeDBRequest = async (sql_string, pool = undefined) => {
  try {
    if (!pool) {
      pool = await createDBPool()
    }
    let res = await pool.query(sql_string)
    return res
  } catch (e) {
    console.log(`error createPool ${e}`)
  }
}
