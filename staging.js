import readline from 'readline'
import pull from './pull'

const confirm = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const args = process.argv.slice(2)
const files = {
    production: '/var/www/html',
    staging: '/var/www/staging',
}

if ( args[0] === 'pull' ) {
    pull( files )
}

if ( args[0] === 'push' ) {
    console.log( 'pushing files to production' )
}