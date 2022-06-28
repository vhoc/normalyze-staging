const arguments = process.argv.slice(2)

if ( arguments[0] === 'pull' ) {
    console.log( 'pulling files from production' )
}

if ( arguments[0] === 'push' ) {
    console.log( 'pulling files to production' )
}