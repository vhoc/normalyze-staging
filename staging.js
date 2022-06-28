import chalk from "chalk"
import pull from './pull.js'

const args = process.argv.slice(2)
const files = {
    production: '/var/www/html',
    staging: '/var/www/staging',
}
const databases = {
    production: 'normalyze',
    staging: 'staging',
    backupPath: '/var/www/backups/db'
}

if ( process.getuid() !== 0 ) {
    console.error( chalk.redBright( `ERROR: You must run this tool as root, otherwise some files might fail to copy.` ) )
    process.exit(1)
}

if ( args[0] === 'pull' ) {
    pull( files, databases )
}

if ( args[0] === 'push' ) {
    console.log( 'pushing files to production' )
}