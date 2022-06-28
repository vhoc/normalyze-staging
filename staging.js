const arguments = process.argv

if ( arguments[0] === 'pull' ) {
    console.log( 'pulling files from production' )
}

if ( arguments[0] === 'push' ) {
    console.log( 'pulling files to production' )
}