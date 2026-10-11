// 数据库连接初始化：若 uav.db 不存在，则从 database/schema.sql 自动建库
const path = require('path')
const fs = require('fs')
const Database = require('better-sqlite3')

const DB_PATH = path.join(__dirname, 'data', 'uav.db')
const SCHEMA_PATH = path.join(__dirname, '..', 'database', 'schema.sql')

function initDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })
  const needInit = !fs.existsSync(DB_PATH)
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  // mock 数据中部分帕累托解引用的实验编号在原始数据里存在缺口（如 11），
  // 为兼容历史 mock 数据，这里不强制开启外键约束。
  if (needInit) {
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8')
    db.exec(schema)
    console.log('[db] 已从 schema.sql 初始化数据库:', DB_PATH)
  }
  return db
}

module.exports = initDb()
