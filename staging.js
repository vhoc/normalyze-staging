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

if ( args[0] === 'pull' ) {
    pull( files, databases )
}

if ( args[0] === 'push' ) {
    console.log( 'pushing files to production' )
}