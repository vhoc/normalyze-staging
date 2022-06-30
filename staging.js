import chalk from "chalk"
import pull from './pull.js'
import fakepush from './fakepush.js'
import 'dotenv/config'

const args = process.argv.slice(2)

const files = {
    production: process.env.FILES_PRODUCTION,
    fake: process.env.FILES_FAKE,
    staging: process.env.FILES_STAGING,
}

const databases = {
    production: process.env.DB_PRODUCTION,
    fake: process.env.DB_FAKE,
    staging: process.env.DB_STAGING,
    backupPath: process.env.DB_BACKUP_PATH
}

const url = {
    production: process.env.URL_PRODUCTION,
    fake: process.env.URL_FAKE,
    staging: process.env.URL_STAGING,
}

if ( process.getuid() !== 0 ) {
    console.error( chalk.redBright( `ERROR: You must run this tool as root, otherwise some files might fail to copy.` ) )
    process.exit(1)
}

if ( args[0] === 'pull' ) {
    pull( files, databases, url )
}

if ( args[0] === 'fakepush' ) {
    fakepush( files, databases, url )
}