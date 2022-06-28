
import pull from 'pull'

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